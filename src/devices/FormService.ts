import {getRandomID} from '../constants'

// On provider creation submit, the new topic will be added here.
// Can be used by consumer form, for example.
export const AVAILABLE_TOPICS: Array<string> = []

function createSubmit(label: string) {
    const submit = document.createElement('input')
    submit.setAttribute('type', 'submit')
    submit.setAttribute('value', label)
    return submit
}

export function generateProviderForm(formRoot: HTMLFormElement | null) {
    if (formRoot) {
        // topic
        const topicId = getRandomID()
        const topicLabel = document.createElement('label')
        topicLabel.setAttribute('for', topicId)
        topicLabel.textContent = 'Topic'
        const topicInput = document.createElement('input')
        topicInput.id = topicId
        topicInput.setAttribute('type', 'text')
        topicInput.setAttribute('name', 'topic')
        topicInput.setAttribute('placeholder', 'Kitchen-Light')

        /*
         strategy
         (this could be made dynamic if we register all available strategies somewhere -
         and before form creation)
        */
        const strategyId = getRandomID()
        const strategyLabel = document.createElement('label')
        strategyLabel.setAttribute('for', strategyId)
        strategyLabel.textContent = 'Use Case'
        const strategyInput = document.createElement('select')
        strategyInput.id = topicId
        strategyInput.setAttribute('name', 'strategy')
        const boolOption = document.createElement('option')
        boolOption.setAttribute('value', 'booleanStrategy')
        boolOption.textContent = 'Boolean Value'
        strategyInput.appendChild(boolOption)
        const numberOption = document.createElement('option')
        numberOption.setAttribute('value', 'numberStrategy')
        numberOption.textContent = 'Number Value'
        strategyInput.appendChild(numberOption)


        const submit = createSubmit('Add Provider')


        formRoot.appendChild(topicLabel)
        formRoot.appendChild(topicInput)
        formRoot.appendChild(document.createElement('br'))
        formRoot.appendChild(strategyLabel)
        formRoot.appendChild(strategyInput)
        formRoot.appendChild(submit)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()
            console.log('todo: create provider')
        })
    }
}

export function generateConsumerForm(formRoot: HTMLFormElement | null) {
    if (formRoot) {

        const submit = createSubmit('Add Consumer')
        formRoot.appendChild(submit)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()
            console.log('todo: create consumer')
        })
    }
}
