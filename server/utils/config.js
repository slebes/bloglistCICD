require('dotenv').config()

const inProduction = process.env.NODE_ENV === 'prodtesting' || process.env.NODE_ENV === 'production'

let PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === ('test' || 'prodtesting')
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI


module.exports = {
  inProduction,
  MONGODB_URI,
  PORT
}
