import {Strategy, StrategyType} from './Strategy'
import {EventData} from '../../entities/EventData'
import {createCustomEvent, getFormDataAttribute, setDataAttribute} from '../../domUtils'
import {addGlobalConsumerDisplay, getRandomID, TOPIC_CONSUMER_MAP} from '../../constants'

const classOff = 'bool-strategy-off'
const classOn = 'bool-strategy-on'

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

    createProviderElement(topic: string, label?: string): HTMLElement {
        const randomID = getRandomID()
        const formElement = document.createElement('form')
        formElement.classList.add('bool-strategy-form')

        const labelElement = document.createElement('label')
        setDataAttribute(labelElement, getFormDataAttribute('provider-item-label_' + topic))
        labelElement.textContent = label ? label : topic
        labelElement.setAttribute('for', randomID)

        const inputElement = document.createElement('input')
        setDataAttribute(inputElement, getFormDataAttribute('provider-item-input_' + topic))
        inputElement.id = randomID
        inputElement.setAttribute('type', 'checkbox')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.addEventListener('click', (event) => {
            const checkboxElement = event.target as HTMLInputElement
            const checkboxEvent = createCustomEvent(topic, randomID, checkboxElement?.checked)
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
