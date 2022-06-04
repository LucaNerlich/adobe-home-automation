import {Strategy} from '../strategies/Strategy'

export abstract class Consumer {
    abstract id: string
    abstract label: string
    abstract topic: string
    abstract strategy: Strategy

    abstract getElement(): HTMLElement;
}
