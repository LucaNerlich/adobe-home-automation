import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'

export class NumberStrategy extends Strategy {

    createConsumerElement(eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value: number = parseFloat(eventData.value)
        if (!isNaN(value)) {
            consumerDisplay.textContent = value.toString()
        } else {
            // set default
            consumerDisplay.textContent = 'N/A'
        }

        return consumerDisplay
    }

    update(event: Event): void {
        event.preventDefault()

        const eventData: EventData = (<CustomEvent>event).detail as EventData

        // force typecast
        const displayElement = this as unknown as HTMLElement
        // get the element that actually holds the displayed value in case of bool strategy
        const displayValueSpan = displayElement.querySelector('span:first-of-type')

        if (displayValueSpan) {
            displayValueSpan.textContent = eventData.value
        }
    }
}
