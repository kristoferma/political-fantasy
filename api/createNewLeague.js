const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const { name, date } = req.body
  const txn = dgraphClient.newTxn()
  try {
    const token = req.user
    const mu = new dgraph.Mutation()
    mu.setSetJson({
      leagueName: name,
      leagueOwner: { uid: token.userID },
      leagueDate: date,
      leaguePlayers: { uid: token.userID },
    })
    const assigned = await txn.mutate(mu)
    txn.commit()
    res.status(200).send({ leagueID: assigned.getUidsMap().get('blank-0') })
  } catch (error) {
    console.error(error)
    res.sendStatus(409)
  }
}
