describe('forms.cy.ts', () => {
    it('index.html should consumer form', () => {
        cy.visit('/')
        cy.get('#container-consumer-form')
        cy.get('#consumer-form')
    })

    it('index.html should provider form', () => {
        cy.visit('/')
        cy.get('#container-provider-form')
        cy.get('#provider-form')
    })
})
