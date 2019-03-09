const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const { leagueID } = req.body
  const { userID } = req.user
  const txn = dgraphClient.newTxn()
  try {
    const query = `{
      league(func: uid(${leagueID})) @filter(has(leagueName) AND has(leagueDate)) {
        uid
        leagueName
        leaguePlayers {
          uid
       }
      }
  }`
    const results = await dgraphClient.newTxn().query(query)
    const json = results.getJson()
    const dbData = json.league[0]
    if (dbData.length === 0)
      return res.send({ error: `League${leagueID} does not exist` })
    if (
      dbData.leaguePlayers &&
      dbData.leaguePlayers.some(player => player.uid === userID)
    )
      return res.send({ error: `You have already joined this league` })

    const mu = new dgraph.Mutation()
    mu.setSetJson({
      uid: leagueID,
      leaguePlayers: {
        uid: userID,
      },
    })
    await txn.mutate(mu)
    await txn.commit()

    return res.send({ data: { leagueID, leagueName: dbData.leagueName } })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  } finally {
    txn.discard()
  }
}
