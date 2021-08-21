const jwt = require('jsonwebtoken')

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
    const user = jwt.verify(request.token, process.env.SECRET)
    request.user = user
    next()
  } catch (err) {
    console.log(err)
    return response.status(401).json({ error: 'Token invalid.' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor
}