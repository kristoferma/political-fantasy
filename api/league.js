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
      ~picker @filter(uid_in(league, ${leagueID})) {
        uid
        pickedCongressPerson {
        	uid
          title
          first_name
          middle_name
          last_name
          date_of_birth
          party{
            name
          }
          seniority
          state {
            name
          }
        }
      }
      ~leaguePlayers @filter(uid(${leagueID})) {
        leagueName
        leagueDate
      }
    }
  }`
  const results = await dgraphClient.newTxn().query(query)
  const json = results.getJson()
  const leagueData = json.league[0]['~leaguePlayers'][0]
  const pickData = json.league[0]['~picker'][0]
  const data = { leagueData, pickData }
  if (req.accepts('html')) return app.render(req, res, '/league', { data })
  return res.json({ data })
}
