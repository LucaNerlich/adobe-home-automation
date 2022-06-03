import {Strategy} from "../strategies/Strategy";
import {EventData} from "../entities/EventData";
import {getRandomID} from "../constants";

export abstract class Consumer {
    id: string = getRandomID();
    abstract label: string;

    abstract getDisplayElement(): HTMLElement;

    abstract update(eventData: EventData): void;

    abstract _strategy: Strategy;

    set strategy(value: Strategy) {
        this._strategy = value;
    }
}
