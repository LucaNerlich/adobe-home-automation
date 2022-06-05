import {Consumer} from './Consumer'
import {Strategy} from '../strategies/Strategy'
import {getRandomID} from '../../constants'
import {createDeletionButton, replaceSpaceWithDash} from '../../domUtils'

/**
 * Represents a single consumer.
 * Ensures that the needed values are present and provides a single,
 * core function which returns the consumers' HTML Element.
 * This mocks an IOT Devices api in a home automation setting.
 * The returned element represents a lightbulb or the temperature display of a heating device, for example.
 */
export class ConsumerImpl extends Consumer {
    id: string
    label: string
    topic: string
    strategy: Strategy

    constructor(topic: string, label: string, strategy: Strategy) {
        super()
        this.id = getRandomID()
        this.topic = replaceSpaceWithDash(topic)
        this.label = label
        this.strategy = strategy
    }

    /**
     * Returns a simple div to be used as a generic wrapper around every consumer item.
     * @param id -> unique uuid
     * @param label -> optional value, specify to add a data-label attribute
     */
    private static getConsumerWrapper(id: string, label?: string): HTMLElement {
        const consumerRootContainer = document.createElement('div')
        consumerRootContainer.id = id
        consumerRootContainer.classList.add('consumer-item')

        if (label && label.length > 0) {
            consumerRootContainer.setAttribute('data-label', label)
        }

        return consumerRootContainer
    }

    getElement(): HTMLElement {
        const consumerWrapper = ConsumerImpl.getConsumerWrapper(this.id, this.getLabel())
        consumerWrapper.textContent = this.getLabel() + ': '
        consumerWrapper.appendChild(this.getDisplayElement())

        const topicHint = document.createElement('p')
        topicHint.textContent = this.topic
        consumerWrapper.appendChild(createDeletionButton(this.id))
        consumerWrapper.appendChild(topicHint)
        return consumerWrapper
    }

    private getDisplayElement(): HTMLElement {
        return this.strategy.createConsumerElement(this.topic, {
            label: this.label,
            id: this.id,
            value: false,
        })
    }

    private getLabel() {
        return this.label ? this.label : 'simple-consumer'
    }
}
