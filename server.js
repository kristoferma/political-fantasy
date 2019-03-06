const next = require('next')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwtMiddleware = require('express-jwt')

const dgraph = require('dgraph-js')
const grpc = require('grpc')
const { sign } = require('jsonwebtoken')

const signup = require('./api/signup')
const login = require('./api/login')
const createNewLeague = require('./api/createNewLeague')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, quiet: true })
const handle = app.getRequestHandler()

const jwt = jwtMiddleware({
  secret: 'prump',
  getToken: req => {
    return req.cookies.politicalFantasy
  },
})

const clientStub = new dgraph.DgraphClientStub(
  'localhost:9080',
  grpc.credentials.createInsecure()
)
const dgraphClient = new dgraph.DgraphClient(clientStub)

app.prepare().then(() => {
  const server = express()
  server.use(cors())
  server.use(bodyParser.json())
  server.use(cookieParser())

  server.post('/api/signup', signup)
  server.post('/api/login', login)

  server.post('/api/createNewLeague', jwt, createNewLeague)

  server.get('/api/verifyLogin', jwt, (req, res) => {
    res.send(req.user)
  })
  server.post('/api/logout', jwt, (req, res) => {
    try {
      res.clearCookie('politicalFantasy')
      res.status(200).send({ message: 'Succesfully Signed Out' })
    } catch (error) {
      res.status(500).send(error)
    }
  })

  server.get('/leagues', jwt, async (req, res) => {
    const { userID } = req.user
    const query = `{
      myLeagues(func: uid(0x507d)){
        ~leaguePlayers: {
          uid
          leagueName
          leagueDate
        }
      }
    }`
    const data = await dgraphClient.newTxn().query(query)
    const json = data.getJson()
    if (req.accepts('html')) return app.render(req, res, '/leagues', json)
    return res.json(json)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
