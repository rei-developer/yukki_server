const Router = require('koa-router')
const authMiddleware = require('../middlewares/auth.middleware')
const userRoute = require('./user.route')

const app = new Router()

app.use('/auth/:type', authMiddleware.decodeToken, userRoute.routes())

module.exports = app
