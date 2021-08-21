import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (
    <form onSubmit={addBlog} >
      <div>
        title:
        <input
          id='title'
          data-cy='title'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          id='author'
          data-cy='author'
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          id='url'
          data-cy='url'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button data-cy='create-button' type="submit">create </button>
    </form>)
}

export default BlogForm