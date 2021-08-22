require('dotenv').config()
const common = require('@root/config/common')


let PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === ('test' || 'prodtesting')
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI


module.exports = {
  ...common,
  MONGODB_URI,
  PORT
}
