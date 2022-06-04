import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'

export class NumberStrategy extends Strategy {

    createDisplayElement(eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value: number = parseFloat(eventData.value)
        if (!isNaN(value)) {
            consumerDisplay.textContent = value.toString() + 'f'
        }

        return consumerDisplay
    }

    update(event: Event): void {
        event.preventDefault()
        const eventData: EventData = (<CustomEvent>event).detail as EventData
    }
}
