const cryptoJs = require('crypto-js')
const dotenv = require('dotenv')

dotenv.config({path: `.env.${process.env.NODE_ENV}`})

const {CRYPTO_SECRET_KEY} = process.env

module.exports.encrypt = text => cryptoJs.AES.encrypt(text, CRYPTO_SECRET_KEY).toString()

module.exports.decrypt = text => cryptoJs.AES.decrypt(text, CRYPTO_SECRET_KEY).toString(cryptoJs.enc.Utf8)
