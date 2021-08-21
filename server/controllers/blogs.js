const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const userExtractor = middleware.userExtractor

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  if (!body.title || !body.url) return response.status(400).json({ error: 'Title or url missing.' }).end()
  const token = request.token
  const user = request.user
  console.log(token)
  if (!token || !user.id) {
    return response.status(401).json({ error: 'Token missing or invalid.' })
  }
  const userInDb = await User.findById(user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: userInDb
  })

  const savedBlog = await blog.save()
  userInDb.blogs = userInDb.blogs.concat(savedBlog._id)
  await userInDb.save()
  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {

  const blogId = request.params.id
  const token = request.token

  if (!token) return response.status(401).json({ error: 'Token missing or invalid.' })

  const blog = await Blog.findById(blogId)
  const user = request.user

  if (blog.user.toString() !== user.id) return response.status(401).json({ error: 'Token user does not match blog user.' })

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    likes: body.likes,
    author: body.author,
    url: body.url,
    title: body.title
  }
  try {
    const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updated)
  } catch (expectation) {
    next(expectation)
  }
})

module.exports = blogRouter