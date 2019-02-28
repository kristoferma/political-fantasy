const { json, send, createError, run } = require('micro')
const dgraph = require('dgraph-js')
const grpc = require('grpc')
const { sign, verify } = require('jsonwebtoken')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

const login = async (req, res) => {
  const transaction = dgraphClient.newTxn()
  try {
    const { email, password } = await json(req)
    const query = `
        {
          loginAttempt(func: eq(email, "${email}")) {
            email
            checkpwd(password, "${password}")
          }
        }   
    `
    const response = await transaction.query(query)
    const result = await response.getJson()
    if (result.loginAttempt.length === 0) {
      const mutation = new dgraph.Mutation()
      mutation.setSetJson({ email, password })
      await transaction.mutate(mutation)
      await transaction.commit()
      res.setHeader('Set-Cookie', sign({ email }, 'prump'))
      send(res, 200, {
        message: 'Account created, user logged in',
        token: sign({ email }, 'prump')
      })
    } else if (
      result.loginAttempt.length > 0 &&
      result.loginAttempt[0]['checkpwd(password)']
    ) {
      res.setHeader('Set-Cookie', sign({ email }, 'prump'))
      send(res, 200, {
        message: 'Account already exists, user logged in'
      })
    } else {
      send(res, 409, {
        error:
          'Sorry, this email is used by another account. Please select a new email'
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