const jwt = require('jsonwebtoken')
const utils = require('./config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else request.token = null
  next()
}



const userExtractor = (request, response, next) => {
  if (!request.token) return response.status(401).json({ error: 'Token missing.' })
  try {
    const user = jwt.verify(request.token, utils.SECRET)
    request.user = user
    next()
  } catch (err) {
    return response.status(401).json({ error: 'Token invalid.' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor
}