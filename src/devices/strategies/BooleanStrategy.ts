import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'

const classOff = 'bool-strategy-off'
const classOn = 'bool-strategy-on'

export class BooleanStrategy extends Strategy {

    private static parseValue(eventData: EventData) {
        return (
            (eventData.value > 0 || eventData.value < 0) ||
            (eventData.value === 'true') ||
            (eventData.value === true)
        )
    }

    private static setValue(state: boolean, consumerDisplay: HTMLSpanElement) {
        if (state) {
            consumerDisplay.textContent = 'ON'
            if (consumerDisplay.classList.contains(classOff)) {
                consumerDisplay.classList.remove(classOff)
            }

            consumerDisplay.classList.add(classOn)
        } else {
            consumerDisplay.textContent = 'OFF'
            if (consumerDisplay.classList.contains(classOn)) {
                consumerDisplay.classList.remove(classOn)
            }
            consumerDisplay.classList.add(classOff)
        }
    }

    createDisplayElement(eventData: EventData): HTMLSpanElement {
        const state: boolean = BooleanStrategy.parseValue(eventData)
        const consumerDisplay = document.createElement('span')

        BooleanStrategy.setValue(state, consumerDisplay)

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
