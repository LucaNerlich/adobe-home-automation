import {EventData} from '../entities/EventData'

const label = 'some-string'
test('Validate EventData properties', () => {
    const value = 'some-value'
    const id = 'some-id'
    const eventData = {
        label: label,
        value: value,
        id: id,
    } as EventData

    expect(eventData).not.toBe(null)
    expect(eventData?.label).toBe(label)
    expect(eventData?.value).toBe(value)
    expect(eventData?.id).toBe(id)
})
