import {Consumer} from './Consumer'
import {Strategy} from '../strategies/Strategy'
import {getRandomID} from '../../constants'

export class ConsumerImpl extends Consumer {
    id: string
    label: string
    topic: string
    strategy: Strategy

    constructor(topic: string, label: string, strategy: Strategy) {
        super()
        this.id = getRandomID()
        this.topic = topic
        this.label = label
        this.strategy = strategy
    }

    private getDisplayElement(): HTMLElement {
        // initialize with default data
        return this.strategy.createConsumerElement(this.topic, {
            label: 'some-simple-consumer',
            id: this.id,
            value: false,
        })
    }

    getElement(): HTMLElement {
        const consumerWrapper = this.getConsumerWrapper(this.id, this.getLabel())
        consumerWrapper.textContent = this.getLabel() + ': '
        consumerWrapper.appendChild(this.getDisplayElement())

        const topicHint = document.createElement('p')
        topicHint.textContent = this.topic
        consumerWrapper.appendChild(topicHint)
        return consumerWrapper
    }

    private getLabel() {
        return this.label ? this.label : 'simple-consumer'
    }

    /**
     * Returns a simple div to be used as a generic wrapper around every consumer item.
     * @param id -> unique uuid
     * @param label -> optional value, specify to add a data-label attribute
     */
    private getConsumerWrapper(id: string, label?: string): HTMLElement {
        const consumerRootContainer = document.createElement('div')
        consumerRootContainer.id = id
        consumerRootContainer.classList.add('consumer-item')

        if (label && label.length > 0) {
            const labelAttribute = label.replace(' ', '-')
            consumerRootContainer.setAttribute('data-label', labelAttribute)
        }

        return consumerRootContainer
    }
}
