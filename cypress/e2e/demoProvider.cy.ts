describe('demoProvider.cy.ts', () => {
    it('Should contain three demo provider', () => {
        cy.visit('/')
        cy.get('#provider > :nth-child(2)').within(() => {
            cy.get('label')
            cy.get('input').should('have.attr', 'type').and('equal', 'checkbox')
        })
        cy.get('#provider > :nth-child(3)').within(() => {
            cy.get('label')
            cy.get('input').should('have.attr', 'type').and('equal', 'checkbox')
        })
        cy.get('#provider > :nth-child(4)').within(() => {
            cy.get('label')
            cy.get('input').should('have.attr', 'type').and('equal', 'number')
        })
    })

    it('Clicking light-1 -> two consumer on, one off', () => {
        cy.visit('/')
        cy.get('#provider > :nth-child(2)').within(() => {
            cy.get('label')
            cy.get('input').click()
        })

        cy.get('#consumer > :nth-child(2)').within(() => {
            cy.get('span').should('have.class', 'bool-strategy-on')
        })
        cy.get('#consumer > :nth-child(3)').within(() => {
            cy.get('span').should('have.class', 'bool-strategy-on')
        })
        cy.get('#consumer > :nth-child(4)').within(() => {
            cy.get('span').should('have.class', 'bool-strategy-off')
        })
    })
})
