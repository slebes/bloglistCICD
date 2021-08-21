describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Bob Tester',
      username: 'tester',
      password: 'salaperainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function () {
    cy.get('#login-form').should('be.visible')
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#login-button').should('be.visible')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('tester')
      cy.get('#password').type('salaperainen')
      cy.get('#login-button').click()
      cy.get('.alert')
        .should('contain', 'logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('hacker')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      const user = {
        username: 'tester',
        password: 'salaperainen'
      }
      cy.login(user)
    })

    it('A blog can be created', function () {
      cy.contains('create blog').click()
      cy.get('[data-cy=title]').type('test blog')
      cy.get('[data-cy=author]').type('Bob the tester')
      cy.get('[data-cy=url]').type('http://www.example.com/index.html')
      cy.get('[data-cy=create-button]').click()
      cy.contains('test blog Bob the tester')
    })

    describe.only('A blog exists', function () {
      beforeEach(function () {
        const firstBlog = {
          title: 'first testing blog',
          author: 'author for testing',
          url: 'http://www.example.com/testing',
          likes: 0
        }
        const secondBlog = {
          title: 'second testing blog',
          author: 'testing author',
          url: 'http://www.example.com/testing2',
          likes: 5
        }
        const thirdBlog = {
          title: 'third testing blog',
          author: 'tester',
          url: 'http://www.example.com/testing3',
          likes: 1
        }
        cy.createBlog(firstBlog)
        cy.createBlog(secondBlog)
        cy.createBlog(thirdBlog)
      })
      it('A blog can be liked', function () {
        cy.contains('first testing blog').find('[data-cy=view-button]').click()
        cy.get('[data-cy=like-button]').click()
        cy.get('[data-cy=likes]').contains(1)
      })
      it('A blog can be removed', function () {
        cy.contains('first testing blog').find('[data-cy=view-button]').click()
        cy.contains('first testing blog').get('[data-cy=remove-button]').click()
        cy.should('not.contain', 'first testing blog')
      })
      it('Blogs are sorted by likes', function () {
        cy.get('[data-cy=view-button]').click({ multiple: true })
        cy.get('[data-cy=blogs]').get('[data-cy=likes]').then((likes) => {
          // map so we get number of likes of each element
          const likesArray = likes.map((i, e) => parseInt(e.innerText)).get()
          // Returns true if every element is smaller or equal compared to previous element
          const sorted = likesArray.every((v, i, a) => !i || a[i - 1] >= v)
          cy.wrap(sorted).should('equal', true)
        })
      })
      it('Blogs are sorted by likes when likes change.', function () {
        cy.contains('first testing blog').find('[data-cy=view-button]').click()
        cy.get('[data-cy=like-button]').click({ timeout: 2000 }).click({ timeout: 2000 })

        cy.get('[data-cy=view-button]').click({ multiple: true })
        cy.get('[data-cy=blogs]').get('[data-cy=likes]').then((likes) => {
          const likesArray = likes.map((i, e) => parseInt(e.innerText)).get()
          const sorted = likesArray.every((v, i, a) => !i || a[i - 1] >= v)
          cy.wrap(sorted).should('equal', true)
        })
      })
    })
  })
})