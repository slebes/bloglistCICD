const { countBy, maxBy, groupBy, map } = require('lodash')

const dummy = () => {
  return 1
}
const total = (blogs) => {

  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favourite = (blogs) => {
  const reducer = (fav, current) => {
    return (fav.likes > current.likes)
      ? fav
      : current
  }


  return blogs.length === 0
    ? null
    : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {

  const blogCounts = countBy(blogs, 'author')
  const reducer = (max, current) => {
    return (max > current)
      ? max
      : current
  }
  return blogs.length === 0
    ? null
    : Object.keys(blogCounts).reduce(reducer)
}

const mostLikes = (blogs) => {

  //group by author and map
  const grouped = groupBy(blogs, 'author')

  const reducer = (sum, cur) => {
    return sum + cur.likes
  }
  const reduced = (groupedBlogs) => {
    const author = groupedBlogs[0].author
    return {
      author: author,
      likes: groupedBlogs.reduce(reducer, 0)
    }
  }

  const mapped = map(grouped, reduced)
  return blogs.length === 0
    ? null
    : maxBy(mapped, 'likes').author

}

module.exports = {
  dummy,
  total,
  favourite,
  mostBlogs,
  mostLikes
}
