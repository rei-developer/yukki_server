const {
  ID_TOKEN_NOT_FOUND,
  NOT_AUTHORIZED,
} = require('../config/error_exceptions.json')
const {getAuth} = require('firebase-admin/auth')

class AuthMiddleware {
  async decodeToken(ctx, next) {
    const idToken = ctx.get('x-access-id-token')
    const ip = ctx.get('x-real-ip')
    const header = ctx.header['user-agent']
    if (!idToken) {
      ctx.throw(401, ID_TOKEN_NOT_FOUND)
      return
    }
    const {type} = ctx.request.params
    ctx.state.ip = ip
    ctx.state.header = header
    ctx.state.authType = type
    ctx.state.idToken = idToken
    switch (type) {
      case 'google':
        await _decodeTokenByGoogle(ctx, next)
        break
      default:
        console.log('none auth type')
        break
    }
  }
}

async function _decodeTokenByGoogle(ctx, next) {
  const {idToken} = ctx.state
  try {
    ctx.state.user = await getAuth().verifyIdToken(idToken)
  } catch (_) {
    ctx.throw(401, NOT_AUTHORIZED)
  }
  await next()
}

module.exports = new AuthMiddleware()
