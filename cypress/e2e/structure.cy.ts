describe('spec.cy.ts', () => {
    it('index.html should have h1', () => {
        cy.visit('/')
        cy.contains('Home Automation')
    })

    it('index.html should have h2', () => {
        cy.visit('/')
        cy.contains('Control your Smart Home devices')
        cy.contains('Your Smart Home')
    })

    it('index.html should have h3', () => {
        cy.visit('/')
        cy.contains('Create Provider')
        cy.contains('Create Consumer')
    })
})
