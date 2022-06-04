import {Strategy} from './Strategy'
import {EventData} from '../entities/EventData'

export class NumberStrategy extends Strategy {
    label: string

    constructor(label?: string) {
        super()
        this.label = label ? label : ''
    }

    getDisplayElement(eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value: number = parseFloat(eventData.value)
        if (!isNaN(value)) {
            consumerDisplay.textContent = value.toString() + 'f'
        }

        return consumerDisplay
    }
}
