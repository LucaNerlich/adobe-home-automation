import {AVAILABLE_TOPICS, CONSUMER_FORM_ID, getRandomID} from '../constants'
import {StrategyType} from './strategies/Strategy'
import {createDeviceWithFormData, DeviceType} from './DeviceService'
import {createDataAttribute} from '../domUtils'
import {DataAttribute} from '../entities/DataAttribute'

export const TOPIC_FORM_NAME = 'topic'
export const NAME_FORM_NAME = 'name'
export const STRATEGIES_FORM_NAME = 'strategies'

export function createSubmit(label: string) {
    const submit = document.createElement('input')
    submit.setAttribute('type', 'submit')
    submit.setAttribute('value', label)
    return submit
}

export function createSelectOption(label: string): HTMLElement {
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

    formRoot.appendChild(document.createElement('br'))
    formRoot.appendChild(topicSelectLabel)
    formRoot.appendChild(strategySelectInput)
}

function generateErrorSpan(message: string) {
    const submitErrorId = getRandomID()
    const submitErrorSpan = document.createElement('span')
    submitErrorSpan.setAttribute('role', 'error')
    submitErrorSpan.id = submitErrorId
    submitErrorSpan.style.display = 'none'
    submitErrorSpan.style.color = 'red'
    submitErrorSpan.textContent = message

    return submitErrorSpan
}

function getFormDataAttribute(value: string) {
    return createDataAttribute('form-element', value)
}

function setDataAttribute(element: HTMLElement, dataAttribute: DataAttribute): void {
    element.setAttribute(dataAttribute.type, dataAttribute.value)
}

export function getTopicValue(topicInput: string) {
    return topicInput?.replaceAll(' ', '-')
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
        const submitErrorSpan = generateErrorSpan('Invalid: Duplicate Topic')
        formRoot.appendChild(submit)
        formRoot.appendChild(submitErrorSpan)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()

            const form = event.target as HTMLFormElement
            const formData = new FormData(form)

            // validate provider form
            let isValid: boolean = true
            formData.forEach((value, key) => {
                if (key === TOPIC_FORM_NAME) {
                    const topicValue = getTopicValue(value.toString())
                    if (AVAILABLE_TOPICS.includes(topicValue)) {
                        submitErrorSpan.style.display = ''
                        isValid = false
                    } else {
                        AVAILABLE_TOPICS.push(topicValue)
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

        // name
        const nameId = getRandomID()
        const nameLabel = document.createElement('label')
        nameLabel.setAttribute('for', nameId)
        setDataAttribute(nameLabel, getFormDataAttribute('consumer-name-label'))
        nameLabel.textContent = 'Name'

        const nameInput = document.createElement('input')
        nameInput.id = nameId
        setDataAttribute(nameInput, getFormDataAttribute('consumer-name-input'))
        nameInput.setAttribute('type', 'text')
        nameInput.setAttribute('name', NAME_FORM_NAME)
        nameInput.setAttribute('placeholder', 'Kitchen-Light 1')
        nameInput.setAttribute('required', 'true')

        // build the form in order
        formRoot.appendChild(nameLabel)
        formRoot.appendChild(nameInput)

        generateTopicSelect(formRoot)
        createStrategySelect(formRoot)

        const submit = createSubmit('Add Consumer')
        const submitErrorSpan = generateErrorSpan('Invalid: Name cannot be empty.')
        formRoot.appendChild(submit)
        formRoot.appendChild(submitErrorSpan)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement
            const formData = new FormData(form)

            // validate consumer form
            let isValid: boolean = true
            formData.forEach((value, key) => {
                if (key === NAME_FORM_NAME) {
                    if (value.toString().trim().length === 0) {
                        // @FIXME figure out why the form is being submitted twice.
                        // submitErrorSpan.style.display = ''
                        isValid = false
                    } else {
                        isValid = true
                    }
                }
            })

            if (isValid) {
                submitErrorSpan.style.display = 'none'
                form.reset()
                // create and add new consumer
                createDeviceWithFormData(formData, DeviceType.CONSUMER)
            }
        })
    }
}
