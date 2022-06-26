import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * Strategy that represents a number input, e.g. to set the temperature of a heating device.
 * The current implementation is just a float value from 0 to 1 in 0.1 steps.
 * This simulates the % of the max value the consumer device could be set to.
 * Of course, either this strategy or another could implement a more lenient number-field.
 */
export class NumberStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.NUMBER_STRATEGY
    readonly registryService = useRegistryService()

    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const numberField = event.target as HTMLInputElement
        const checkboxEvent = createCustomEvent(topic, randomID, numberField?.valueAsNumber)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(checkboxEvent)
        })
    }

    /**
     * Do we handle only 0 -> 1 as % value for simplicity’s sake?
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'number-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'number')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('min', '0')
        inputElement.setAttribute('max', '1')
        inputElement.setAttribute('step', '0.1')
        inputElement.setAttribute('placeholder', '% max. value')
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
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
        this.registryService.addConsumer(topic, consumerDisplay)
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
