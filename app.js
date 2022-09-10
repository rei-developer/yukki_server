const Koa = require('koa')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const Logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const v1Api = require('./routes')
const limiterMiddleWare = require('./middlewares/limiter.middleware')
const serviceAccount = require('./config/service_account.json')
const firebaseConfig = require('./config/firebase_config.json')

const {
  initializeApp,
  cert,
} = require('firebase-admin/app')

initializeApp(
  {
    credential: cert(serviceAccount),
    ...firebaseConfig,
  },
)

const PORT = process.env.PORT || 50000

const app = new Koa()
const router = new Router()

app
  .use(helmet())
  .use(Logger())
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, () => console.log(`Server is running in port ${PORT}`))
router
  .use('/v1', limiterMiddleWare.rateLimit, v1Api.routes())
