const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

async function setSchema() {
  const schema = `email: string @index(exact) @upsert .
  pass: password .`

  const operation = new dgraph.Operation()
  operation.setSchema(schema)
  try {
    await dgraphClient.alter(operation)
  } catch (error) {
    console.error(error)
  }
}

async function login(username, password) {
  const transaction = dgraphClient.newTxn()
  try {
    const query = `
    {
      login_attempt(func: eq(email, "${username}")) {
        checkpwd(pass, "${password}")
      }
    }   
`
    const variables = {
      $username: 'kristoferma@me.com',
      $password: 'password'
    }
    const response = await transaction.query(query)
    const json = await response.getJson()
    return json.login_attempt[0]['checkpwd(pass)']
  } catch (error) {
    console.error(error)
  } finally {
    await transaction.discard()
  }
}

setSchema()
;(async () => console.log(await login('kristoferma@me.com', 'password')))()
