const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')


describe('blog tests', () => {

  beforeEach(async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
    const user = new User({
      username: helper.initialUser.username,
      name: helper.initialUser.name,
      passwordHash: passwordHash
    })
    await user.save()
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs(user.id))

  })

  test('correct ammount of blogs of type JSON is returned', async () => {
    await api
      .get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(function (obj) {
        return Object.keys(obj).length
      }, helper.initialBlogs.length)
  })

  test('blogs can be added to db', async () => {

    const user = await helper.findInitialUser()
    const newBlog = {
      _id: '5a422a851b54a676234d17f3',
      title: 'Testing 101',
      author: 'Sluubels',
      url: 'https://google.com',
      likes: 3,
      user: user.toJSON.id,
      __v: 0
    }
    const blogsAtStart = await helper.blogsInDb()
    const token = await helper.tokenForInitialUser()
    await api
      .post('/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

  })
  test('if no token is given', async () => {

    const user = await helper.findInitialUser()
    const newBlog = {
      _id: '5a422a851b54a676234d17f3',
      title: 'Testing 101',
      author: 'Sluubels',
      url: 'https://google.com',
      likes: 3,
      user: user.toJSON.id,
      __v: 0
    }
    const blogsAtStart = await helper.blogsInDb()
    await api
      .post('/blogs')
      .send(newBlog)
      .expect(401)
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

  })

  test('if key, likes, is not given it will be 0', async () => {

    const user = await helper.findInitialUser()
    const newBlog =
    {
      _id: '60d9f21d17b83d232b7c86b3',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      user: user.toJSON.id,
      __v: 0
    }
    const token = await helper.tokenForInitialUser()
    await api
      .post('/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)

    const blogs = await helper.blogsInDb()
    const blog = blogs.find(blog => blog.title === 'TDD harms architecture')
    expect(blog.likes).toBeDefined
    expect(blog.likes).toBe(0)

  })

  test('if title is not defined', async () => {
    const user = await helper.findInitialUser()
    const noTitleBlog =
    {
      _id: '5a422ba71b54a676234d17fb',
      author: 'Slepes',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 10,
      user: user.toJSON.id,
      __v: 0
    }
    const token = await helper.tokenForInitialUser()
    await api
      .post('/blogs')
      .send(noTitleBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })

  test('if no url is defined', async () => {
    const user = await helper.findInitialUser()
    const noUrlBlog =
    {
      _id: '5a422ba71b54a676234d17fs',
      author: 'Sleeppes',
      title: 'Testing without Url',
      likes: 15,
      user: user.toJSON.id,
      __v: 0
    }
    const token = await helper.tokenForInitialUser()
    await api
      .post('/blogs')
      .send(noUrlBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })


  test('id test', async () => {
    const response = await api.get('/blogs')

    const contents = response.body
    contents.forEach(element => {
      expect(element.id).toBeDefined()
    })
  })

  test('updating blog', async () => {

    const blog = {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 7,
      __v: 0
    }

    const response = await api.put(`/blogs/${blog._id}`).send(blog)
    expect(response.body.likes).toBe(7)
  })

})


describe('user tests', () => {
  test('valid user can be added', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'sluubels',
      name: 'Kimmo Lehtilä',
      password: 'salaperainen'
    }
    await api
      .post('/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('user without password or username', async () => {
    const usersAtStart = await helper.usersInDb()
    const noUserNUser = {
      name: 'Markku M',
      password: 'salaperainen'
    }
    const noPassWUser = {
      username: 'sluubels',
      name: 'Kimmo Lehtilä'
    }
    await api
      .post('/users')
      .send(noPassWUser)
      .expect(400)

    await api
      .post('/users')
      .send(noUserNUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('user with too short password or username', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithShortPassW = {
      username: 'sluubels',
      name: 'Kimmo Lehtilä',
      password: 'sa'
    }
    const userWithShortUName = {
      username: 'sl',
      name: 'Kimmo Lehtilä',
      password: 'salaperainen'
    }
    await api
      .post('/users')
      .send(userWithShortPassW)
      .expect(400)

    await api
      .post('/users')
      .send(userWithShortUName)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})