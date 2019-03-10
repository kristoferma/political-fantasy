const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const { userID } = req.user
  const { leagueID } = req.params
  const query = `{
    player(func: uid(${userID})) {
       ~leaguePlayers @filter(uid(${leagueID})){
        ~league {
          picker {
            name
          }
          pickedCongressPerson {
            first_name
            middle_name
            last_name
            ~mentionedCongressPerson {
              mentionCount
            }
          }
        }
      }
    }
  }`
  try {
    const data = await dgraphClient.newTxn().query(query)
    const json = data.getJson()
    const leaguePicks = json.player[0]['~leaguePlayers'][0]['~league']
    return res.json({ data: leaguePicks })
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}
