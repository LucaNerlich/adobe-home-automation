/**
 * @jest-environment jsdom
 */

import {createCustomEvent, createDataAttribute} from '../domUtils'

const topic = 'some-topic'
const id = 'some-id'
const value = 'some-value'
const dataAttributeSuffix = 'form-element'

test('createCustomEvent returns CustomEvent', () => {
    const customEvent = createCustomEvent(topic, id, value)

    expect(customEvent).not.toBe(null)
    expect(customEvent.type).toBe(topic)
    expect(customEvent.detail).not.toBe(null)
    expect(customEvent.detail.id).toBe(id)
    expect(customEvent.detail.value).toBe(value)
})

test('getDataAttribute returns DataAttribute', () => {
    const dataAttribute = createDataAttribute(dataAttributeSuffix, value)

    expect(dataAttribute).not.toBe(null)
    expect(dataAttribute.type).toBe('data-' + dataAttributeSuffix)
    expect(dataAttribute.value).toBe(value)
})
