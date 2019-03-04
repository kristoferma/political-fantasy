const { send, run } = require('micro')
const parseCookies = require('micro-cookie')
const { verify } = require('jsonwebtoken')

const verifyLogin = parseCookies(async (req, res) => {
  try {
    const token = verify(req.cookies.fantasyPolitics, 'prump')
    send(res, 200, { name: token.name })
  } catch (error) {
    send(res, 409)
  }
})

module.exports = (req, res) => run(req, res, verifyLogin)
