import {CONSUMER_CONTAINER_ID, FORMS_CONTAINER_ID, PROVIDER_CONTAINER_ID} from './constants'
import {EventData} from './entities/EventData'

export function getConsumerContainer(): HTMLElement | null {
    return document.getElementById(CONSUMER_CONTAINER_ID)
}

export function getProviderContainer(): HTMLElement | null {
    return document.getElementById(PROVIDER_CONTAINER_ID)
}

export function getFormsContainer(): HTMLElement | null {
    return document.getElementById(FORMS_CONTAINER_ID)
}

/**
 * Returns a simple div to be used as a generic wrapper around every consumer item.
 * @param id -> unique uuid
 * @param label -> optional value, specify to add a data-label attribute
 */
export function getConsumerWrapper(id: string, label?: string): HTMLElement {
    const consumerRootContainer = document.createElement('div')
    consumerRootContainer.id = id
    consumerRootContainer.classList.add('consumer-item')

    if (label && label.length > 0) {
        const labelAttribute = label.replace(' ', '-')
        consumerRootContainer.setAttribute('data-label', labelAttribute)
    }

    return consumerRootContainer
}

export function createCustomEvent(topic: string, id: string, value: any): CustomEvent {
    return new CustomEvent(topic, {
        detail: {
            id: id,
            value: value,
        } as EventData,
    })
}
