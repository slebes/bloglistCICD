require('dotenv').config()

const inProduction = process.env.NODE_ENV === 'prodtesting' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'pipelinetest'

let PORT = process.env.PORT || 3003

const i = process.argv.length


const mongouri = () => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prodtesting') return process.env.TEST_MONGODB_URI
  else if (process.env.NODE_ENV === 'pipelinetest') {
    return process.argv[i-2]
  }
  else return process.env.MONGODB_URI
}

const MONGODB_URI = mongouri()

console.log('MONGODB_URI', MONGODB_URI)

const SECRET = process.env.SECRET ? process.env.SECRET : process.argv[i-1]

console.log('SECRET', SECRET)

module.exports = {
  SECRET,
  inProduction,
  MONGODB_URI,
  PORT
}
