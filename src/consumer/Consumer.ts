import {Strategy} from "../strategies/Strategy";

export abstract class Consumer {
    abstract id: string;
    abstract label: string;

    abstract getDisplayElement(): HTMLElement;

    abstract getElement(): HTMLElement;

    abstract update: Function;

    abstract _strategy: Strategy;

    set strategy(value: Strategy) {
        this._strategy = value;
    }
}
