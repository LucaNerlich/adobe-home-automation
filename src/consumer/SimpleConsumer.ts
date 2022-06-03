import {Consumer} from "./Consumer";
import {EventData} from "../entities/EventData";
import {Strategy} from "../strategies/Strategy";

export class SimpleConsumer extends Consumer {
    label: string;
    _strategy: Strategy;

    constructor(label: string, strategy: Strategy) {
        super();
        this.label = label;
        this._strategy = strategy;
    }

    getDisplayElement(): HTMLElement {
        // initialize with default data
        return this._strategy.getDisplayElement({
            label: "Kitchen Light Switch",
            id: this.id,
            value: false,
        });
    }

    update(eventData: EventData): void {
        console.log("eventData", eventData);
    }

}
