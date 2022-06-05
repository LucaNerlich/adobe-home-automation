describe('device.cy.ts', () => {
    it('Delete button should delete its provider', () => {
        cy.visit('/')
        cy.get('#provider').within(() => {
            cy.get('button').click({multiple: true})
            cy.get('button').should('not.exist')
        })
    })

    it('Delete button should delete its consumer', () => {
        cy.visit('/')
        cy.get('#consumer').within(() => {
            cy.get('button').click({multiple: true})
            cy.get('button').should('not.exist')
        })
    })
})
