/**
 * @jest-environment jsdom
 */

import {createSelectOption, createSubmit} from '../devices/FormService'

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
