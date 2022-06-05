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

    it('provider form should create provider and add topic to consumer form', () => {
        cy.visit('/')
        cy.get('#provider-form > input[data-form-element="provider-topic-input"]').type(someTopic)
        cy.get('#provider-form >  input[type=submit][data-form-element="submit_add-provider"]').click()

        cy.get('#provider > :nth-child(5)').within(() => {
            cy.get('label[data-form-element="provider-item-label_some-topic"]').should('have.text', someTopic)
            cy.get('input[data-form-element="provider-item-input_some-topic"]').should('have.attr', 'type').and('equal', 'checkbox')
        })

        cy.get('#consumer-form > select[name=topic]').select(someTopic).should('exist')
    })

    it('consumer form should create consumer', () => {
        cy.visit('/')
        cy.get('#provider-form')
    })
})
