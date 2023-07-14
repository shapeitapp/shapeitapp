describe('home page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
  })

  it('h1 contains the correct text', () => {
    cy.getByData("hero-heading").contains("Shape Up dashboard")
    cy.getByData("hero-heading").contains("for GitHub Projects")
  })

  it('contains a GitHub Signing button', () => {
    cy.getByData("github-sign-in").contains("Sign in using GitHub")
  })
})