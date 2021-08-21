import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component
  let handleLike

  beforeEach(() => {
    handleLike = jest.fn()
    const user = {
      name: 'Pro tester'
    }
    const blog = {
      title: 'test blog',
      author: 'tester',
      url: 'www.testing.com',
      likes: '5',
      user: user
    }
    component = render(
      <Blog blog={blog} user={user} handleLike={handleLike} />
    )
  })

  test('by default renders title and author, but no likes or url', () => {


    expect(component.container).toHaveTextContent('test blog')
    expect(component.container).toHaveTextContent('tester')
    expect(component.container).not.toHaveTextContent('www.testing.com')
    expect(component.container).not.toHaveTextContent('5')

    component.debug()
  })

  test('url and likes are shown when expanded', () => {

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('test blog')
    expect(component.container).toHaveTextContent('tester')
    expect(component.container).toHaveTextContent('www.testing.com')
    expect(component.container).toHaveTextContent('5')

    component.debug()

  })

  test('like button works', () => {

    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})

