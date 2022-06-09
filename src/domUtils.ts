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

export function replaceSpaceWithDash(value: string) {
    return value?.replaceAll(' ', '-').toLowerCase()
}

export function createBaseForm(id: string, label: string): HTMLFormElement {
    const formElement = document.createElement('form')
    formElement.classList.add(`${label}-form`)
    formElement.id = id

    return formElement
}

export function createDataAttribute(suffix: string, value: any): DataAttribute {
    return {
        type: 'data-' + suffix,
        value: value,
    } as DataAttribute
}

export function getFormDataAttribute(value: string) {
    return createDataAttribute('form-element', value)
}

export function setDataAttribute(element: HTMLElement, dataAttribute: DataAttribute): void {
    element.setAttribute(dataAttribute.type, dataAttribute.value)
}

/**
 * returns a button that on click deletes the element with the given id
 * @param elementId -> ID of the HTMLElement to remove from the DOM
 */
export function createDeletionButton(elementId: string): HTMLButtonElement {
    function deleteElement() {
        document.getElementById(elementId)?.remove()
    }

    const button = document.createElement('button')
    button.textContent = 'X'
    button.addEventListener('click', deleteElement)
    button.classList.add('delete')
    setDataAttribute(button, getFormDataAttribute('delete-' + elementId))

    return button
}
