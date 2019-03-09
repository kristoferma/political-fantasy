const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const { userID } = req.user
  const { pickID, leagueID } = req.body
  console.log({ pickID, leagueID })
  const txn = dgraphClient.newTxn()
  try {
    const token = req.user
    const mu = new dgraph.Mutation()
    mu.setSetJson({
      picker: { uid: userID },
      pickedCongressPerson: {
        uid: pickID,
      },
      league: {
        uid: leagueID,
      },
    })
    await txn.mutate(mu)
    txn.commit()
    res.status(200).send({ name: token.name })
  } catch (error) {
    console.error(error)
    res.sendStatus(409)
  }
}
