const { send, run, createError } = require('micro')
const parseCookies = require('micro-cookie')
const { sign } = require('jsonwebtoken')

const verifyLogin = parseCookies(async (req, res) => {
  try {
    const token = sign({}, 'prump', { expiresIn: 0 })
    res.setHeader('Set-Cookie', `fantasyPolitics=${token}`)
    send(res, 200, { message: 'Succesfully Signed Out' })
  } catch (error) {
    throw createError(400, error)
  }
})

module.exports = (req, res) => run(req, res, verifyLogin)
