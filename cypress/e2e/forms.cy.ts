const someTopic = 'some-topic'
const someName = 'some-name'

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

        // create provider
        cy.get('#provider-form > input[data-form-element="provider-topic-input"]').type(someTopic)
        cy.get('#provider-form > input[type=submit][data-form-element="submit_add-provider"]').click()

        // validate created provider
        cy.get('#provider > :nth-child(6)').within(() => {
            cy.get('label[data-form-element="provider-item-label_some-topic-label"]').should('have.text', someTopic)
            cy.get('input[data-form-element="provider-item-input_some-topic-input"]').should('have.attr', 'type').and('equal', 'checkbox')
        })

        // check if a new topic has been added to consumer topic select
        cy.get('#consumer-form > select[name=topic]').select(someTopic).should('exist')
    })

    it('consumer form should create consumer and subscribe to topic', () => {
        cy.visit('/')

        // create consumer
        cy.get('#consumer-form > input[data-form-element="consumer-name-input"]').type(someName)
        cy.get('#consumer-form > select[data-form-element="consumer-topic-select"]').select('light-2')
        cy.get('#consumer-form > input[type=submit][data-form-element="submit_add-consumer"]').click()

        // validate created consumer
        cy.get('#consumer > div[data-label="some-name"]').within(() => {
            cy.get('span').should('have.text', 'OFF')
            cy.get('p').should('have.text', 'light-2')
        })

        cy.get('#provider > :nth-child(3)[class~=bool-strategy-form]').within(() => {
            cy.get('input').click()
        })

        // validate that the created consumer changed its value
        cy.get('#consumer > div[data-label="some-name"]').within(() => {
            cy.get('span').should('have.text', 'ON')
            cy.get('p').should('have.text', 'light-2')
        })
    })
})
