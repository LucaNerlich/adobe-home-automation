const someTopic = 'some-topic'

describe('forms.cy.ts', () => {
    it('index.html should have consumer form', () => {
        cy.visit('/')
        cy.get('#container-consumer-form')
        cy.get('#consumer-form')
    })

    it('index.html should have provider form', () => {
        cy.visit('/')
        cy.get('#container-provider-form')
        cy.get('#provider-form')
    })

    it('provider form should create provider', () => {
        cy.visit('/')
        cy.get('#provider-form > :nth-child(2)').type(someTopic)
        cy.get('#provider-form >  input[type=submit]').click()

        cy.get('#provider > :nth-child(5)').within(() => {
            cy.get('label').should('have.text', someTopic)
            cy.get('input').should('have.attr', 'type').and('equal', 'checkbox')
        })

        cy.get('#consumer-form > select[name=topic]').select(someTopic).should('exist')
    })

    it('consumer form should create consumer', () => {
        cy.visit('/')
        cy.get('#provider-form')
    })
})
