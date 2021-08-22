const inProduction = process.env.NODE_ENV === 'prodtesting' || process.env.NODE_ENV === 'production'


module.exports = {
  inProduction,
}
