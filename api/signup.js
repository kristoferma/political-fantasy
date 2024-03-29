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
    const { email, password, name } = req.body
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
      res.cookie('politicalFantasy', sign({ email, name, userID }, 'prump'))
      res.status(200).send({
        message: 'Account created, user logged in',
        name,
      })
    } else {
      res.status(409).send({
        error:
          'Sorry, this email is used by another account. Please select a new email',
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  } finally {
    transaction.discard()
  }
}
