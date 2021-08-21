import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'
import loginService from '../services/login'
import BlogForm from './BlogForm'
import Togglable from './Togglable'


const Alert = ({ message }) => {

  if (message === null) return null
  return (
    <div className="alert">{message} </div>
  )
}

const Error = ({ message }) => {
  if (message === null) return null
  return (
    <div className="error">{message} </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [alert, setAlert] = useState(null)
  const [error, setError] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // useEffect for getting initial blog state
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])
  console.log('blogs', blogs)

  // useEffect for logging
  useEffect(() => {
    const user = window.localStorage.getItem('loggedBlogUser')
    if (user) {
      const jsonUser = JSON.parse(user)
      setUser(jsonUser)
      blogService.setToken(jsonUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('halo')
    try {
      console.log('halo2')
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setError(null)
      setAlert('logged in')
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (exception) {
      setError('wrong username or password')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form id='login-form' onSubmit={handleLogin} >
        <div>
          username:
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login </button>
      </form >)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setAlert('logged out')
    setTimeout(() => {
      setAlert(null)
    }, 5000)
  }

  const addBlog = async (blog) => {
    try {
      const resp = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(resp))
      setAlert(`Blog: ${resp.title} by author: ${resp.author} was added`)
      setTimeout(() => {
        setAlert(null)
      }, 5000)
    } catch (createError) {
      setError(`${createError.message}: ${createError.response.statusText}. ${createError.response.data.error}`)
      console.log(createError.response)
      if (createError.response.status === 401) handleLogout()
      setTimeout(() => {
        setError(null)
      }, 5000)
    }

  }

  const remove = async (removedBlog) => {
    if (window.confirm(`Do you want to remove the blog: ${removedBlog.title}`)) {
      try {
        await blogService.remove(removedBlog)
        setBlogs(blogs.filter(blog => blog.id !== removedBlog.id))
        setAlert(`Blog: ${removedBlog.title} removed`)
        setTimeout(() => {
          setAlert(null)
        }, 5000)
      } catch (error) {
        setError(`${error.message}: ${error.response.statusText}. ${error.response.data.error}`)
        if (error.response.status === 401) handleLogout()
        setTimeout(() => {
          setError(null)
        }, 5000)
      }
    }
  }

  const handleLike = async (likedBlog) => {
    const updatedBlog = { ...likedBlog, likes: likedBlog.likes + 1 }
    console.log(updatedBlog)
    await blogService.like(updatedBlog)
    setBlogs(blogs.map(blog => blog.id === likedBlog.id ? updatedBlog : blog))
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel={'create blog'} ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )



  return (
    <div>
      {user === null
        ? <div>
          <h2>log in to application</h2>
          <Alert message={alert} />
          <Error message={error} />
          {loginForm()}
        </div>

        :
        <div>
          <h2>blogs</h2>
          <Alert message={alert} />
          <Error message={error} />
          <div>
            {user.name} logged in
            <button onClick={handleLogout}>logout </button>
          </div>
          <div>
            <h2>create new</h2>
            {blogForm()}
          </div>
          <div data-cy="blogs">
            {blogs.sort((blog1, blog2) => blog1.likes > blog2.likes ? -1 : 1).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                remove={remove}
                user={user}
              />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App