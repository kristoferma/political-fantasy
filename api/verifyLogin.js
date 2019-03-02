const { json, send, createError, run } = require('micro')
const parseCookies = require('micro-cookie')
const dgraph = require('dgraph-js')
const grpc = require('grpc')
const { verify } = require('jsonwebtoken')

const verifyLogin = parseCookies(async (req, res) => {
  const token = verify(req.cookies.fantasyPolitics, 'prump')
  console.log(token)
  send(res, 200, { name: token.name })
})

module.exports = (req, res) => run(req, res, verifyLogin)
