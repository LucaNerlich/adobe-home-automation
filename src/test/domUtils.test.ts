/**
 * @jest-environment jsdom
 */

import {createCustomEvent} from '../domUtils'

const topic = 'some-topic'
const id = 'some-id'
const value = 'some-value'

test('createCustomEvent returns CustomEvent', () => {
    const customEvent = createCustomEvent(topic, id, value)

    expect(customEvent).not.toBe(null)
    expect(customEvent.type).toBe(topic)
    expect(customEvent.detail).not.toBe(null)
    expect(customEvent.detail.id).toBe(id)
    expect(customEvent.detail.value).toBe(value)
})
