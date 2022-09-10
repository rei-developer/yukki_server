const RateLimit = require('koa2-ratelimit').RateLimit

class LimiterMiddleware {
  rateLimit = RateLimit.middleware({
    interval: 60 * 1000,
    max: 20,
    timeWait: 3 * 1000,
    message: 'TOO_MANY_REQUEST'
  })
}

module.exports = new LimiterMiddleware()
