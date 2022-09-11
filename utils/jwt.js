const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: `.env.${process.env.NODE_ENV}`})

const {JSON_WEB_TOKEN_SECRET_KEY} = process.env

module.exports.verifyJwt = async token =>
  await new Promise((resolve, reject) => {
    jwt.verify(token, JSON_WEB_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err) {
        reject(false)
        return
      }
      resolve(payload)
    })
  })

module.exports.generateJwt = async (args, expiresIn = '30d') =>
  await new Promise((resolve, _) =>
    resolve(jwt.sign(args, JSON_WEB_TOKEN_SECRET_KEY, {expiresIn})))
