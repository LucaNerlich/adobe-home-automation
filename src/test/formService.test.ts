/**
 * @jest-environment jsdom
 */

import {
    CONSUMER_FORM_NAME,
    createInputElement,
    createLabelElement,
    createSelectOption,
    createSubmit,
    generateConsumerForm,
    generateProviderForm,
    STRATEGIES_FORM_NAME,
    TOPIC_FORM_NAME,
} from '../devices/FormService'
import {AVAILABLE_TOPICS} from '../devices/RegistryService'

const label = 'some-label'
const topic = 'some-topic'
const id = 'some-id'
const type = 'some-type'

test('createSubmit returns input element', () => {
    const submit = createSubmit(label)

    expect(submit).not.toBe(null)
    expect(submit.getAttribute('type')).toBe('submit')
    expect(submit.getAttribute('value')).toBe(label)
})

test('createSelectOption returns option element', () => {
    const option = createSelectOption(label)

    expect(option).not.toBe(null)
    expect(option.getAttribute('value')).toBe(label)
    expect(option.textContent).toBe(label)
})

test('createLabelElement returns label element', () => {
    const labelElement = createLabelElement(id, label, type)

    expect(labelElement).not.toBe(null)
    expect(labelElement.getAttribute('for')).toBe(id)
    expect(labelElement.getAttribute('data-form-element')).toBe(type + '-label')
    expect(labelElement.textContent).toBe(label)
})

test('createInputElement returns input element', () => {
    const inputElement = createInputElement(id, label, type)

    expect(inputElement).not.toBe(null)
    expect(inputElement.id).toBe(id)
    expect(inputElement.getAttribute('type')).toBe(type)
    expect(inputElement.getAttribute('data-form-element')).toBe(label + '-input')
})

test('generateProviderForm correctly prepares provider-form', () => {
    const formRoot = document.createElement('form')

    generateProviderForm(formRoot)
    expect(formRoot).not.toBe(null)
    expect(formRoot.childElementCount).not.toBe(0)
})

test('generateConsumerForm correctly prepares consumer-form', () => {
    AVAILABLE_TOPICS.push(topic)
    const formRoot = document.createElement('form')

    generateConsumerForm(formRoot)
    expect(formRoot).not.toBe(null)
    expect(formRoot.childElementCount).not.toBe(0)

    // test name label
    const nameLabel = formRoot.querySelector('label')
    expect(nameLabel).not.toBe(null)
    expect(nameLabel?.getAttribute('for')).not.toBe(null)

    // test name input
    const nameInput = formRoot.querySelector('input')
    expect(nameInput).not.toBe(null)
    expect(nameInput?.getAttribute('type')).toBe('text')
    expect(nameInput?.getAttribute('name')).toBe(CONSUMER_FORM_NAME)
    expect(nameInput?.getAttribute('placeholder')).toBe('Name')
    expect(nameInput?.getAttribute('required')).toBe('true')

    // test submit
    const submit = formRoot.querySelector('input[type=submit]')
    expect(submit).not.toBe(null)

    // test error span
    const errorSpan = formRoot.querySelector('span[role=error]') as HTMLElement
    expect(errorSpan).not.toBe(null)
    expect(errorSpan?.id).not.toBe(null)
    expect(errorSpan?.textContent).not.toBe(null)
    expect(errorSpan?.style.display).toBe('none')
    expect(errorSpan?.style.color).toBe('red')

    // test br
    const br = formRoot.querySelector('br') as HTMLElement
    expect(br).not.toBe(null)

    // test topic select label
    const childNodes = formRoot.children
    const topicLabel = childNodes.item(3) as HTMLElement
    expect(topicLabel).not.toBe(null)
    expect(topicLabel?.getAttribute('for')).not.toBe(null)
    expect(topicLabel?.textContent).toBe('Available Topics')

    // test topic select dropdown
    const topicSelect = childNodes.item(4) as HTMLElement
    expect(topicSelect).not.toBe(null)
    expect(topicSelect?.getAttribute('name')).toBe(TOPIC_FORM_NAME)

    // test strategy select label
    const strategyLabel = childNodes.item(6) as HTMLElement
    expect(strategyLabel).not.toBe(null)
    expect(strategyLabel?.textContent).toBe('Use Case')
    expect(strategyLabel?.getAttribute('for')).not.toBe(null)

    // test strategy select dropdown
    const strategySelect = childNodes.item(7) as HTMLElement
    expect(strategySelect).not.toBe(null)
    expect(strategySelect?.getAttribute('name')).toBe(STRATEGIES_FORM_NAME)
})
