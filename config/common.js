const inProduction = process.env.NODE_ENV === 'production' || 'prod-testing'

module.exports = {
  inProduction,
}
