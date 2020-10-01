import * as RateLimit from 'express-rate-limit'
const env = process.env.NODE_ENV || 'dev'
const rateLimitTime = Number(process.env.RATE_LIMIT_TIME) || 15
const rateLimitRequest = Number(process.env.RATE_LIMIT_REQUEST) || 100

export default () => {
  if (env === 'production') {
    return new RateLimit({
      windowMs: rateLimitTime * 60 * 1000,
      max: rateLimitRequest,
      delays: 0,
      handler: `Rate limit Exceeded, Please Try again in ${rateLimitTime} minutes`
    })
  }

  return new RateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3000, // limit each IP to 3000 requests per windowMs
    delayMs: 0,
    handler: `Rate limit exceeded, please try again later in ${rateLimitTime} time.`
  })
}
