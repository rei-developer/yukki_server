const Router = require('koa-router')
const Controller = require('../controllers/user.controller')

const app = new Router()

app
  .get('/verify', Controller.verifyUser)
  .get('/profile', Controller.getUserProfile)
  .post('/add', Controller.addUser)

module.exports = app
