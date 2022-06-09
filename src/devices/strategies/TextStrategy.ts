import {Strategy, StrategyType} from './Strategy'
import {EventData} from '../../entities/EventData'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {addGlobalConsumerDisplay, getRandomID, TOPIC_CONSUMER_MAP} from '../../constants'
import {createInputElement, createLabelElement} from '../FormService'

export class TextStrategy extends Strategy {
    strategyType: StrategyType = StrategyType.TEXT_STRATEGY

    createConsumerElement(topic: string, eventData: EventData): HTMLElement {
        const consumerDisplay = document.createElement('span')
        consumerDisplay.textContent = eventData.value
        consumerDisplay.addEventListener(topic, this.update)
        addGlobalConsumerDisplay(topic, consumerDisplay)
        return consumerDisplay
    }

    createProviderElement(topic: string, label?: string): HTMLElement {
        const formID = getRandomID()
        const form = createBaseForm(formID, 'text-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        form.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'text')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('placeholder', 'some led display')
        inputElement.addEventListener('input', (event) => this.dispatchEvent(event, topic, labelID))
        form.appendChild(inputElement)

        form.appendChild(createDeletionButton(formID))

        return form
    }

    dispatchEvent(event: Event, ...args: string[]): void {
        const topic = args[0] as string
        const randomID = args[1] as string
        const textField = event.target as HTMLInputElement
        const changeEvent = createCustomEvent(topic, randomID, textField?.value)
        const consumers = TOPIC_CONSUMER_MAP.get(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(changeEvent)
        })
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
