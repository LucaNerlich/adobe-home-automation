import {Strategy} from "../strategies/Strategy";
import {getRandomID} from "../constants";

export abstract class Consumer {
    id: string = getRandomID();
    abstract label: string;

    abstract getDisplayElement(): HTMLElement;

    abstract getElement(): HTMLElement;

    abstract update: Function;

    abstract _strategy: Strategy;

    set strategy(value: Strategy) {
        this._strategy = value;
    }
}
