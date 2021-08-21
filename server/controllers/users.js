const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 })
  response.json(users.map(u => u.toJSON()))

})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const username = body.username
  const password = body.password
  const validLength = 3
  if (!(username && password)) {
    return response.status(400).json({ error: 'Undefined username or password.' })
  } else if (username.length < validLength || password.length < validLength) {
    return response.status(400).json({ error: `Password and username shorter than ${validLength}.` })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter