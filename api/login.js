const dgraph = require('dgraph-js')
const grpc = require('grpc')
const { sign } = require('jsonwebtoken')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const transaction = dgraphClient.newTxn()
  try {
    const { email, password } = req.body
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
    if (
      result.loginAttempt.length > 0 &&
      result.loginAttempt[0]['checkpwd(password)']
    ) {
      const dbUser = result.loginAttempt[0]
      res.cookie(
        'politicalFantasy',
        sign(
          { email: dbUser.email, name: dbUser.name, userID: dbUser.uid },
          'prump'
        )
      )
      res.status(200).send({
        message: 'User succesfully logged in',
        name: dbUser.name,
      })
    } else {
      res.status(409).send({
        error: 'Sorry, wrong email or password',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  } finally {
    transaction.discard()
  }
}
