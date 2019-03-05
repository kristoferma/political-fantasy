const { send, run, json, createError } = require('micro')
const parseCookies = require('micro-cookie')
const { verify } = require('jsonwebtoken')
const dgraph = require('dgraph-js')
const grpc = require('grpc')

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

const createNewLeague = async (req, res) => {
  const { name, date } = await json(req)
  const txn = dgraphClient.newTxn()
  try {
    const token = verify(req.cookies.fantasyPolitics, 'prump')
    const mu = new dgraph.Mutation()
    mu.setSetJson({
      leagueName: name,
      leagueOwner: { uid: token.userID },
      leagueDate: date,
      leaguePlayers: { uid: token.userID },
    })
    await txn.mutate(mu)
    txn.commit()
    await send(res, 200, { name: token.name })
  } catch (error) {
    console.error(error)
    send(res, 409)
  }
}

module.exports = (req, res) => run(req, res, createNewLeague)
