const inProduction = process.env.NODE_ENV === 'production' || 'prodtesting'

module.exports = {
  inProduction,
}
