const {
  addUser,
  getUserByUId,
} = require('../database/user.database')
const {encrypt} = require('../utils/crypto-js')
const {generateAccount} = require('../utils/eth-wallet')
const {hasher} = require('../utils/hasher')
const {
  INVALID_PARAMETER,
  ALREADY_EXIST,
} = require('../config/error_exceptions.json')

module.exports.verifyUser = async ctx => {
  const {uid} = ctx.state.user
  const idToken = ctx.state.idToken
  ctx.body = {
    uid,
    idToken,
    hasUser: !!(await getUserByUId(uid)),
  }
}

module.exports.getUserProfile = async ctx => {
  const {
    uid,
    name,
    picture,
  } = ctx.state.user
  ctx.body = {
    uid,
    name,
    profileImageUrl: picture,
  }
}

module.exports.addUser = async ctx => {
  const {password} = ctx.request.body
  if (!password) {
    ctx.throw(400, INVALID_PARAMETER)
    return
  }
  const authType = ctx.state.authType
  const {uid} = ctx.state.user
  if (await getUserByUId(uid)) {
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
      salt: passwordSalt,
    } = await hasher({password})
    ctx.body = await addUser({
      authType,
      uid,
      password: passwordHash,
      salt: passwordSalt,
      address,
      mnemonic: encrypt(mnemonic),
      privateKey: encrypt(privateKey),
    })
  } catch (error) {
    ctx.throw(error.code, error.message)
  }
}
