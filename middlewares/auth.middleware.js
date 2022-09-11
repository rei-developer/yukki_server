const {getAuth} = require('firebase-admin/auth')
const {verifyJwt} = require('../utils/jwt')
const AuthType = require('../config/auth.config')
const {
  ID_TOKEN_NOT_FOUND,
  NOT_AUTHORIZED,
} = require('../config/error_exceptions.json')

class AuthMiddleware {
  async verifyToken(ctx, next) {
    const {authorization} = ctx.request.header
    if (!authorization) {
      ctx.throw(401, ID_TOKEN_NOT_FOUND)
      return
    }
    const [type, token] = authorization.split(' ')
    ctx.state.auth = {type, token}
    switch (type) {
      case AuthType.GOOGLE:
        await AuthMiddleware._verifyTokenByGoogle(ctx, next)
        break
      case AuthType.CUSTOM:
        await AuthMiddleware._verifyTokenByCustom(ctx, next)
        break
    }
  }

  static async _verifyTokenByGoogle(ctx, next) {
    const {token} = ctx.state.auth
    try {
      ctx.state.user = await getAuth().verifyIdToken(token)
    } catch (_) {
      ctx.throw(401, NOT_AUTHORIZED)
    }
    await next()
  }

  static async _verifyTokenByCustom(ctx, next) {
    const {token} = ctx.state.auth
    try {
      ctx.state.user = await verifyJwt(token)
    } catch (_) {
      ctx.throw(401, NOT_AUTHORIZED)
    }
    await next()
  }
}

module.exports = new AuthMiddleware()
