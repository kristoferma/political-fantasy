const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = app => async (req, res) => {
  const { userID } = req.user
  const query = `{
    myLeagues(func: uid(${userID})){
      ~leaguePlayers {
        uid
        leagueName
        leagueDate
      }
    }
  }`
  try {
    const data = await dgraphClient.newTxn().query(query)
    const json = data.getJson()
    const myLeagues = json.myLeagues[0]['~leaguePlayers']
    if (req.accepts('html'))
      return app.render(req, res, '/leagues', { data: myLeagues })
    return res.json({ data: myLeagues })
  } catch (error) {
    return res.sendStatus(500)
  }
}
