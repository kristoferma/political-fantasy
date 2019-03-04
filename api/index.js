const { send } = require('micro')
const login = require('./login')
const signup = require('./signup')
const verifyLogin = require('./verifyLogin')

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
      case '/login':
        await login(req, res)
        break

      case '/verifyLogin':
        await verifyLogin(req, res)
        break

      case '/signup':
        await signup(req, res)
        break

      default:
        send(res, 404, '404. Not found.')
        break
    }
  }
}

module.exports = dev
