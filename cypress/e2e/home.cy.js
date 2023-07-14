describe('home page', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000")
  })

  it('h1 contains the correct text', () => {
    cy.get("[data-test='hero-heading']").contains("Shape Up dashboard")
    cy.get("[data-test='hero-heading']").contains("for GitHub Projects")
  })

  it('contains a GitHub Signing button', () => {
    cy.get("[data-test='github-sign-in']").contains("Sign in using GitHub")
  })
})