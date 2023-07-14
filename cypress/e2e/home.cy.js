describe('home page', () => {
  it('h1 contains the correct text', () => {
    cy.visit('http://localhost:3000')
    cy.get("[data-test='hero-heading']").contains("Shape Up dashboard")
    cy.get("[data-test='hero-heading']").contains("for GitHub Projects")
  })
})