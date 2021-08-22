import React, { useState } from 'react'

const Blog = ({ blog, handleLike, remove, user }) => {

  const [view, setView] = useState(false)

  const removeable = { display: (user && blog.user && (user.username === blog.user.username)) ? '' : 'none' }

  return (
    view === true ?
      <div className="view">
        <div>{blog.title} {blog.author} <button onClick={() => setView(false)} >hide </button> </div>
        <div>{blog.url} </div>
        <div data-cy="likes" >{blog.likes} <button data-cy="like-button" onClick={() => handleLike(blog)}>like </button> </div>
        <div>{blog.user.name}</div>
        <div style={removeable}>
          <button data-cy='remove-button' onClick={() => remove(blog)}>remove </button>
        </div>
      </div>
      :
      <div>
        {blog.title} {blog.author} <button data-cy="view-button" onClick={() => setView(true)}>view </button>
      </div>
  )
}

export default Blog