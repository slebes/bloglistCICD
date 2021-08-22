require('dotenv').config()
const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/login', loginRouter)
app.use('/blogs', blogsRouter)
app.use('/users', usersRouter)
app.get('/version', (req, res) => {
  res.send('1')
})
app.get('/health', (req, res) => {
  res.send('ok')
})

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prodtesting' || process.env.NODE_ENV === 'pipelinetest') {
  const testingRouter = require('./controllers/testing')
  app.use('/testing', testingRouter)
}

module.exports = app