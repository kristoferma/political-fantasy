const next = require('next')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const jwtMiddleware = require('express-jwt')

const dgraph = require('dgraph-js')
const grpc = require('grpc')

const signup = require('./api/signup')
const login = require('./api/login')
const createNewLeague = require('./api/createNewLeague')
const leagues = require('./api/leagues')
const league = require('./api/league')
const congressMembers = require('./api/congressMembers')
const makePick = require('./api/makePick')
const joinLeague = require('./api/joinLeague')
const leagueScore = require('./api/leagueScore')

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

app.prepare().then(() => {
  const server = express()
  server.use(cors())
  server.use(bodyParser.json())
  server.use(cookieParser())

  server.post('/api/signup', signup)
  server.post('/api/login', login)

  server.post('/api/createNewLeague', jwt, createNewLeague)
  server.post('/api/joinLeague', jwt, joinLeague)

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

  server.get('/api/congress', congressMembers)
  server.post('/api/pick', jwt, makePick)

  server.get('/leagues', jwt, leagues(app))
  server.get('/league/:id', jwt, league(app))

  server.get('/api/leagueScore/:leagueID', jwt, leagueScore)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
