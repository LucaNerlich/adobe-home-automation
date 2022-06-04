import {Strategy} from '../strategies/Strategy'

export abstract class Consumer {
    abstract id: string
    abstract label: string
    abstract topic: string
    // abstract update(element: HTMLElement, event: Event): void

    abstract _strategy: Strategy

    set strategy(value: Strategy) {
        this._strategy = value
    }

    abstract getDisplayElement(): HTMLElement;

    abstract getElement(): HTMLElement;
s}
