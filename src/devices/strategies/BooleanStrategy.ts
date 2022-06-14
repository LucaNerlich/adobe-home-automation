import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {getRandomID} from '../../constants'
import {createInputElement, createLabelElement} from '../FormService'
import {addGlobalConsumerDisplay, TOPIC_CONSUMER_MAP} from '../../state'
import {StrategyType} from './StrategyType'

const classOff = 'bool-strategy-off'
const classOn = 'bool-strategy-on'

/**
 * Strategy that represents a basic 'on/off' switch in a home automation setting.
 * For simplicity’s sake, the UI element is a checkbox instead of a button.
 */
export class BooleanStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.BOOLEAN_STRATEGY

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

    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const checkboxElement = event.target as HTMLInputElement
        const checkboxEvent = createCustomEvent(topic, randomID, checkboxElement?.checked)
        const consumers = TOPIC_CONSUMER_MAP.get(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(checkboxEvent)
        })

    }

    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'bool-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'checkbox')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId))
        return formElement
    }

    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const state: boolean = BooleanStrategy.parseValue(eventData)
        const consumerDisplay = document.createElement('span')

        BooleanStrategy.setValue(state, consumerDisplay)

        consumerDisplay.addEventListener(topic, this.update)
        addGlobalConsumerDisplay(topic, consumerDisplay)
        return consumerDisplay
    }

    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        // force typecast
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            BooleanStrategy.setValue(BooleanStrategy.parseValue(eventData), displayElement)
        }
    }
}
