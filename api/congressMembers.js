const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

module.exports = async (req, res) => {
  const query = `{
    membersOfCongress(func: eq(congressNumber, 116)) {
      congressNumber
      ~memberOfCongress{
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
  }`
  const results = await dgraphClient.newTxn().query(query)
  const json = results.getJson()
  const data = json.membersOfCongress[0]['~memberOfCongress']
  return res.json({ data })
}
