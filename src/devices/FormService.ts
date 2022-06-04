import {AVAILABLE_TOPICS, CONSUMER_FORM_ID, getRandomID} from '../constants'
import {StrategyType} from './strategies/Strategy'
import {createDeviceWithFormData, DeviceType} from './DeviceService'

export const TOPIC_FORM_NAME = 'topic'
export const STRATEGIES_FORM_NAME = 'strategies'

function createSubmit(label: string) {
    const submit = document.createElement('input')
    submit.setAttribute('type', 'submit')
    submit.setAttribute('value', label)
    return submit
}

function createSelectOption(label: string): HTMLElement {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', label)
    optionElement.textContent = label

    return optionElement
}

/**
 * this could be made dynamic if we register all available strategies somewhere -
 *         and before form creation
 * @param formRoot
 */
function createStrategySelect(formRoot: HTMLFormElement) {
    const strategyId = getRandomID()
    const strategyLabel = document.createElement('label')
    strategyLabel.setAttribute('for', strategyId)
    strategyLabel.textContent = 'Use Case'

    const strategyInput = document.createElement('select')
    strategyInput.id = strategyId
    strategyInput.setAttribute('name', STRATEGIES_FORM_NAME)

    // https://bobbyhadz.com/blog/typescript-iterate-enum
    Object.keys(StrategyType).filter((v) => isNaN(Number(v))).forEach(strategyType => {
            strategyInput.appendChild(createSelectOption(strategyType))
        },
    )

    formRoot.appendChild(document.createElement('br'))
    formRoot.appendChild(strategyLabel)
    formRoot.appendChild(strategyInput)
}

/**
 * Generates a select dropdown with values from {@link AVAILABLE_TOPICS}.
 * @param formRoot
 */
function generateTopicSelect(formRoot: HTMLFormElement) {
    const topicSelectId = getRandomID()
    const topicSelectLabel = document.createElement('label')
    topicSelectLabel.setAttribute('for', topicSelectId)
    topicSelectLabel.textContent = 'Available Topics'

    const strategySelectInput = document.createElement('select')
    strategySelectInput.id = topicSelectId
    strategySelectInput.setAttribute('name', TOPIC_FORM_NAME)

    AVAILABLE_TOPICS.forEach(topic => {
        strategySelectInput.appendChild(createSelectOption(topic))
    })

    formRoot.appendChild(topicSelectLabel)
    formRoot.appendChild(strategySelectInput)
}

export function getTopicValue(topicInput: string) {
    return topicInput?.replace(' ', '-')
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
        topicInput.setAttribute('name', TOPIC_FORM_NAME)
        topicInput.setAttribute('placeholder', 'Kitchen-Light')
        topicInput.setAttribute('required', 'true')

        // build the form in order
        formRoot.appendChild(topicLabel)
        formRoot.appendChild(topicInput)
        createStrategySelect(formRoot)
        const submit = createSubmit('Add Provider')
        const submitErrorId = getRandomID()
        const submitErrorSpan = document.createElement('span')
        submitErrorSpan.setAttribute('role', 'error')
        submitErrorSpan.id = submitErrorId
        submitErrorSpan.style.display = 'none'
        submitErrorSpan.style.color = 'red'
        submitErrorSpan.textContent = 'Invalid: Duplicate Topic'

        formRoot.appendChild(submit)
        formRoot.appendChild(submitErrorSpan)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()

            const form = event.target as HTMLFormElement
            const formData = new FormData(form)
            let isValid: boolean = true
            formData.forEach((value, key) => {
                if (key === TOPIC_FORM_NAME) {
                    const topicValue = getTopicValue(value.toString())
                    if (AVAILABLE_TOPICS.includes(topicValue)) {
                        submitErrorSpan.style.display = ''
                        console.log('hit')
                        isValid = false
                    } else {
                        AVAILABLE_TOPICS.push(topicValue)
                        // create and add new provider

                        isValid = true
                    }
                }
            })

            if (isValid) {
                // recreate the consumer form with the new topic
                generateConsumerForm(document.getElementById(CONSUMER_FORM_ID) as HTMLFormElement)
                submitErrorSpan.style.display = 'none'
                form.reset()

                // create and add new provider
                createDeviceWithFormData(formData, DeviceType.PROVIDER)
            }
        })
    }
}

export function generateConsumerForm(formRoot: HTMLFormElement | null) {
    if (formRoot) {
        // reset form children
        formRoot.innerHTML = ''

        // build the form in order
        generateTopicSelect(formRoot)
        createStrategySelect(formRoot)
        const submit = createSubmit('Add Consumer')
        formRoot.appendChild(submit)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement
            const formData = new FormData(form)

            // create and add new consumer
            createDeviceWithFormData(formData, DeviceType.CONSUMER)
        })
    }
}
