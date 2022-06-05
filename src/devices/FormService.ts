import {AVAILABLE_TOPICS, getRandomID} from '../constants'
import {StrategyType} from './strategies/Strategy'
import {createDeviceWithFormData, DeviceType} from './DeviceService'
import {getFormDataAttribute, replaceSpaceWithDash, setDataAttribute} from '../domUtils'

export const TOPIC_FORM_NAME = 'topic'
export const CONSUMER_FORM_NAME = 'name'
export const STRATEGIES_FORM_NAME = 'strategies'

export function createSubmit(label: string) {
    const submit = document.createElement('input')
    setDataAttribute(submit, getFormDataAttribute('submit_' + replaceSpaceWithDash(label)))
    submit.setAttribute('type', 'submit')
    submit.setAttribute('value', label)
    return submit
}

export function createSelectOption(label: string): HTMLElement {
    const optionElement = document.createElement('option')
    setDataAttribute(optionElement, getFormDataAttribute('select-option_' + replaceSpaceWithDash(label)))
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
    setDataAttribute(strategyLabel, getFormDataAttribute('strategy-select-label'))
    strategyLabel.setAttribute('for', strategyId)
    strategyLabel.textContent = 'Use Case'

    const strategyInput = document.createElement('select')
    setDataAttribute(strategyInput, getFormDataAttribute('strategy-select'))
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
    setDataAttribute(topicSelectLabel, getFormDataAttribute('consumer-topic-label'))
    topicSelectLabel.setAttribute('for', topicSelectId)
    topicSelectLabel.textContent = 'Available Topics'

    const strategySelectInput = document.createElement('select')
    setDataAttribute(strategySelectInput, getFormDataAttribute('consumer-topic-select'))
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

export function generateProviderForm(formRoot: HTMLFormElement | null) {
    if (formRoot) {
        const labelInputTupel = generateLabelTextInput('Topic', 'provider-topic', TOPIC_FORM_NAME)

        // build the form in order
        formRoot.appendChild(labelInputTupel[0])
        formRoot.appendChild(labelInputTupel[1])
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
            let topic = ''
            formData.forEach((value, key) => {
                if (key === TOPIC_FORM_NAME) {
                    topic = replaceSpaceWithDash(value.toString())
                    if (AVAILABLE_TOPICS.includes(topic)) {
                        submitErrorSpan.style.display = ''
                        isValid = false
                    } else {
                        AVAILABLE_TOPICS.push(topic)
                        isValid = true
                    }
                }
            })

            if (isValid) {
                // add the new topic to the consumer topic select options
                const topicSelect = document.querySelector('#consumer-form > select[data-form-element="consumer-topic-select"]')
                topicSelect?.appendChild(createSelectOption(topic))
                submitErrorSpan.style.display = 'none'
                form.reset()

                // create and add new provider
                createDeviceWithFormData(formData, DeviceType.PROVIDER)
            }
        })
    }
}

/**
 * Generates a <label/> element
 * @param id
 * @param label
 * @param type
 */
export function createLabelElement(id: string, label: string, type?: string): HTMLElement {
    const labelElement = document.createElement('label')
    labelElement.setAttribute('for', id)
    setDataAttribute(labelElement, getFormDataAttribute(type ? type : label + '-label'))
    labelElement.textContent = label
    return labelElement
}

/**
 * Generates an <input/> element with its basic properties.
 * Can and should be adapted afterwards.
 * @param id -> string id, should match its label 'for' attribute value
 * @param dataAttribute -> string value, will be prefixed to the data attribute '-input' value
 * @param type -> the input type, e.g text, number, checkbox
 */
export function createInputElement(id: string, dataAttribute: string, type: string): HTMLElement {
    const inputElement = document.createElement('input')
    inputElement.id = id
    setDataAttribute(inputElement, getFormDataAttribute(dataAttribute + '-input'))
    inputElement.setAttribute('type', type)

    return inputElement
}

/**
 * Generates a Tuple of a <label/> and an <input/> element.
 * @param label -> label / placeholder
 * @param type -> data-form-element attribute value prefix
 * @param name -> name attribute value
 */
function generateLabelTextInput(label: string, type: string, name: string): [HTMLElement, HTMLElement] {
    const labelId = getRandomID()
    const labelElement = createLabelElement(labelId, label, type)

    const inputElement = createInputElement(labelId, type, 'text')
    inputElement.setAttribute('name', name)
    inputElement.setAttribute('placeholder', label)
    inputElement.setAttribute('required', 'true')

    return [labelElement, inputElement]
}

export function generateConsumerForm(formRoot: HTMLFormElement | null) {
    if (formRoot) {
        // reset form children
        formRoot.innerHTML = ''

        const labelInputTupel = generateLabelTextInput('Name', 'consumer-name', CONSUMER_FORM_NAME)
        formRoot.appendChild(labelInputTupel[0])
        formRoot.appendChild(labelInputTupel[1])

        generateTopicSelect(formRoot)
        createStrategySelect(formRoot)

        const submit = createSubmit('Add Consumer')
        formRoot.appendChild(submit)

        const submitErrorSpan = generateErrorSpan('Invalid: Name cannot be empty.')
        formRoot.appendChild(submitErrorSpan)

        // on submit
        formRoot.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target as HTMLFormElement
            const formData = new FormData(form)

            // validate consumer form
            let isValid: boolean = true
            formData.forEach((value, key) => {
                if (key === CONSUMER_FORM_NAME) {
                    if (value.toString().trim().length === 0) {
                        submitErrorSpan.style.display = ''
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
