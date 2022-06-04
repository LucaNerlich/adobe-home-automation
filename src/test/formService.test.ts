/**
 * @jest-environment jsdom
 */

import {
    createSelectOption,
    createSubmit,
    generateConsumerForm,
    generateProviderForm,
    NAME_FORM_NAME,
} from '../devices/FormService'

const label = 'some-label'

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

test('generateProviderForm correctly prepares provider-form', () => {
    const formRoot = document.createElement('form')

    generateProviderForm(formRoot)
    expect(formRoot).not.toBe(null)
    expect(formRoot.childElementCount).not.toBe(0)
})

test('generateConsumerForm correctly prepares consumer-form', () => {
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
    expect(nameInput?.getAttribute('name')).toBe(NAME_FORM_NAME)
    expect(nameInput?.getAttribute('placeholder')).toBe('Kitchen-Light 1')
    expect(nameInput?.getAttribute('required')).toBe('true')

    const submit = formRoot.querySelector('input[type=submit]')
    expect(submit).not.toBe(null)
})
