require('dotenv').config()

const inProduction = process.env.NODE_ENV === 'prodtesting' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'pipelinetest'

let PORT = process.env.PORT || 3003



const mongouri = () => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prodtesting') return process.env.TEST_MONGODB_URI
  else if (process.env.NODE_ENV === 'pipelinetest') {
    const i = process.argv.length
    return process.argv[i-1]
  }
  else return process.env.MONGODB_URI
}

const MONGODB_URI = mongouri()

console.log(MONGODB_URI)

module.exports = {
  inProduction,
  MONGODB_URI,
  PORT
}
