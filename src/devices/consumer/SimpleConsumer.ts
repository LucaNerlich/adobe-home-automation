import {Consumer} from './Consumer'
import {Strategy} from '../strategies/Strategy'
import {getConsumerWrapper} from '../../domUtils'
import {addGlobalConsumer, getRandomID} from '../../constants'

export class SimpleConsumer extends Consumer {
    id: string
    label: string
    _strategy: Strategy

    constructor(label: string, strategy: Strategy) {
        super()
        this.id = getRandomID()
        this.label = label
        this._strategy = strategy
    }

    getDisplayElement(): HTMLElement {
        // initialize with default data
        return this._strategy.createDisplayElement({
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

    addEventHandler(topic: string, callback: any): void {
        addGlobalConsumer(topic, this.getElement())
        this.getElement().addEventListener(topic, callback)
    }

    private getLabel() {
        return this.label ? this.label : 'simple-consumer'
    }


    get strategy(): Strategy {
        return this._strategy
    }
}
