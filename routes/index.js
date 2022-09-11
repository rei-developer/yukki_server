const Router = require('koa-router')
const authMiddleware = require('../middlewares/auth.middleware')
const userRoute = require('./user.route')

const app = new Router()

app.use('/user', authMiddleware.verifyToken, userRoute.routes())

module.exports = app
