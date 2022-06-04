describe('base.cy.ts', () => {
    it('Should open index.html and include three main panels', () => {
        cy.visit('/')
        cy.get('#dashboard')
        cy.get('#consumer')
        cy.get('#provider')
    })
})
