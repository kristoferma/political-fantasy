const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = app => async (req, res) => {
  const leagueID = req.params.id
  const { userID } = req.user
  const query = `{
    league(func: uid(${userID})){
      ~leaguePlayers @filter(uid(${leagueID})) {
        leagueName
        leagueDate
      }
    }
  }`
  const data = await dgraphClient.newTxn().query(query)
  const json = data.getJson()
  const leagueData = json.league[0]['~leaguePlayers'][0]
  if (req.accepts('html'))
    return app.render(req, res, '/league', { data: leagueData })
  return res.json({ data: leagueData })
}
