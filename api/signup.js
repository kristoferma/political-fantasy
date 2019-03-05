const { json, send, createError, run } = require('micro')
const dgraph = require('dgraph-js')
const grpc = require('grpc')
const { sign } = require('jsonwebtoken')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

const login = async (req, res) => {
  const transaction = dgraphClient.newTxn()
  try {
    const { email, password, name } = await json(req)
    const query = `
        {
          loginAttempt(func: eq(email, "${email}")) {
            uid
            email
            checkpwd(password, "${password}")
            name
          }
        }   
    `
    const response = await transaction.query(query)
    const result = await response.getJson()
    if (result.loginAttempt.length === 0) {
      const mutation = new dgraph.Mutation()
      mutation.setSetJson({ email, password, name })
      const assigned = await transaction.mutate(mutation)
      // Get the id of the only mutated node: The UserID
      const userID = assigned.getUidsMap().get('blank-0')
      await transaction.commit()
      res.setHeader(
        'Set-Cookie',
        `fantasyPolitics=${sign({ email, name, userID }, 'prump')}`
      )
      send(res, 200, {
        message: 'Account created, user logged in',
        name,
      })
    } else if (
      result.loginAttempt.length > 0 &&
      result.loginAttempt[0]['checkpwd(password)']
    ) {
      const dbUser = result.loginAttempt[0]
      res.setHeader(
        'Set-Cookie',
        `fantasyPolitics=${sign(
          { email: dbUser.email, name: dbUser.name, userID: dbUser.uid },
          'prump'
        )}`
      )
      send(res, 200, {
        message: 'Account already exists, user logged in',
        name: dbUser.name,
      })
    } else {
      send(res, 409, {
        error:
          'Sorry, this email is used by another account. Please select a new email',
      })
    }
  } catch (error) {
    console.log(error)
    throw createError(error.statusCode, error.statusText)
  } finally {
    transaction.discard()
  }
}

module.exports = (req, res) => run(req, res, login)
