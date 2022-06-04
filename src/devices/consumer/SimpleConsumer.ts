import {Consumer} from './Consumer'
import {Strategy} from '../strategies/Strategy'
import {getConsumerWrapper} from '../../domUtils'
import {getRandomID} from '../../constants'

export class SimpleConsumer extends Consumer {
    id: string
    label: string
    topic: string
    strategy: Strategy

    constructor(topic: string, label: string, strategy: Strategy) {
        super()
        this.id = getRandomID()
        this.label = label
        this.topic = topic
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
        const consumerWrapper = getConsumerWrapper(this.id, this.getLabel())
        consumerWrapper.textContent = this.getLabel() + ': '
        consumerWrapper.appendChild(this.getDisplayElement())
        return consumerWrapper
    }

    private getLabel() {
        return this.label ? this.label : 'simple-consumer'
    }
}
