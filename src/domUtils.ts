import {CONSUMER_CONTAINER_ID, PROVIDER_CONTAINER_ID} from './constants'
import {EventData} from './entities/EventData'
import {DataAttribute} from './entities/DataAttribute'

export function getConsumerContainer(): HTMLElement | null {
    return document.getElementById(CONSUMER_CONTAINER_ID)
}

export function getProviderContainer(): HTMLElement | null {
    return document.getElementById(PROVIDER_CONTAINER_ID)
}

export function createCustomEvent(topic: string, id: string, value: any): CustomEvent {
    return new CustomEvent(topic, {
        detail: {
            id: id,
            value: value,
        } as EventData,
    })
}

export function createDataAttribute(suffix: string, value: any): DataAttribute {
    return {
        type: 'data-' + suffix,
        value: value,
    } as DataAttribute
}
