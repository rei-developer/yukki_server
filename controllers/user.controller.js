const {
  addUser,
  getUserById,
  getUserByAuthTypeAndUId,
} = require('../database/user.database')
const {encrypt} = require('../utils/crypto-js')
const {generateAccount} = require('../utils/eth-wallet')
const {hasher} = require('../utils/hasher')
const {generateJwt} = require('../utils/jwt')
const {
  INVALID_PARAMETER,
  ALREADY_EXIST,
  DOES_NOT_EXIST,
} = require('../config/error_exceptions.json')

module.exports.verifyUser = async ctx => {
  const {type: authType} = ctx.state.auth
  const {uid} = ctx.state.user
  const user = await getUserByAuthTypeAndUId(authType, uid)
  if (!user) {
    ctx.throw(403, DOES_NOT_EXIST)
    return
  }
  ctx.body = {
    uid,
    token: await generateJwt({...user}),
  }
}

module.exports.getUserProfile = async ctx => {
  const {id} = ctx.state.user
  const user = await getUserById(id)
  if (!user) {
    ctx.throw(403, DOES_NOT_EXIST)
    return
  }
  ctx.body = {id, ...user}
}

module.exports.addUser = async ctx => {
  const {password} = ctx.request.body
  if (!password) {
    ctx.throw(400, INVALID_PARAMETER)
    return
  }
  const {type: authType} = ctx.state.auth
  const {uid} = ctx.state.user
  if (await getUserByAuthTypeAndUId(authType, uid)) {
    ctx.throw(403, ALREADY_EXIST)
    return
  }
  const {
    address,
    mnemonic,
    privateKey,
  } = await generateAccount({password})
  try {
    const {
      hash: passwordHash,
      salt,
    } = await hasher({password})
    ctx.body = await addUser({
      authType,
      uid,
      password: passwordHash,
      salt,
      address,
      mnemonic: encrypt(mnemonic),
      privateKey: encrypt(privateKey),
    })
  } catch (error) {
    ctx.throw(error.code, error.message)
  }
}
