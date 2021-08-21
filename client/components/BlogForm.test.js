import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm />', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing blog' }
  })
  fireEvent.change(author, {
    target: { value: 'tester' }
  })
  fireEvent.change(url, {
    target: { value: 'www.testing.com' }
  })
  fireEvent.submit(form)

  const blog = {
    title: 'testing blog',
    author: 'tester',
    url: 'www.testing.com'
  }
  const res = createBlog.mock.calls[0][0]

  expect(res).toEqual(blog)
})