const { send } = require('micro')
const { parse } = require('cookie')
const logout = require('./logout')
const signup = require('./signup')
const verifyLogin = require('./verifyLogin')
const createNewLeague = require('./createNewLeague')

const parseCookies = handler => (req, res) => {
  const cookies = parse((req.headers && req.headers.cookie) || '')
  const newReq = Object.assign(req, { cookies })
  return handler(newReq, res)
}

const dev = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Set-Cookie'
  )

  if (req.method === 'OPTIONS') {
    send(res, 200)
  } else {
    switch (req.url) {
      case '/verifyLogin':
        await verifyLogin(req, res)
        break

      case '/signup':
        await signup(req, res)
        break

      case '/logout':
        await logout(req, res)
        break

      case '/createNewLeague':
        await createNewLeague(req, res)
        break

      default:
        send(res, 404, '404. Not found.')
        break
    }
  }
}

module.exports = parseCookies(dev)
