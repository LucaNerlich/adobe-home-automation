import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {addGlobalConsumerDisplay, getRandomID, TOPIC_CONSUMER_MAP} from '../../constants'
import {createCustomEvent} from '../../domUtils'

export class NumberStrategy extends Strategy {

    /**
     * Do we handle only 0 -> 1 as % value for simplicity’s sake?
     */
    createProviderElement(topic: string, label: string): HTMLElement {
        const randomID = getRandomID()
        const formElement = document.createElement('form')
        formElement.classList.add('number-strategy-form')

        const labelElement = document.createElement('label')
        labelElement.textContent = label
        labelElement.setAttribute('for', randomID)

        const inputElement = document.createElement('input')
        inputElement.id = randomID
        inputElement.setAttribute('type', 'number')
        inputElement.setAttribute('name', label)
        inputElement.setAttribute('min', '0')
        inputElement.setAttribute('max', '1')
        inputElement.setAttribute('step', '0.1')
        inputElement.addEventListener('change', (event) => {
            const numberField = event.target as HTMLInputElement
            const checkboxEvent = createCustomEvent(topic, randomID, numberField?.valueAsNumber)
            const consumers = TOPIC_CONSUMER_MAP.get(topic)
            consumers?.forEach(item => {
                item.dispatchEvent(checkboxEvent)
            })
        })

        formElement.appendChild(labelElement)
        formElement.appendChild(inputElement)
        return formElement
    }

    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value: number = parseFloat(eventData.value)
        if (!isNaN(value)) {
            consumerDisplay.textContent = value.toString()
        } else {
            // set default
            consumerDisplay.textContent = 'N/A'
        }

        consumerDisplay.addEventListener(topic, this.update)
        addGlobalConsumerDisplay(topic, consumerDisplay)
        return consumerDisplay
    }

    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData

        // force typecast
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            displayElement.textContent = eventData.value
        }
    }
}
