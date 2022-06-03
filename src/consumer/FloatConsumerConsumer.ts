import {Consumer} from "./Consumer";
import {Strategy} from "../strategies/Strategy";
import {getConsumerWrapper} from "../domUtils";
import {getRandomID} from "../constants";

export class SimpleConsumer extends Consumer {
    id: string;
    label: string;
    _strategy: Strategy;
    update: Function;

    constructor(label: string, strategy: Strategy, eventCallback: Function) {
        super();
        this.id = getRandomID();
        this.label = label;
        this._strategy = strategy;
        this.update = eventCallback
    }

    getDisplayElement(): HTMLElement {
        // initialize with default data
        return this._strategy.getDisplayElement({
            label: "some-float-consumer",
            id: this.id,
            value: false,
        });
    }

    getElement(): HTMLElement {
        const consumerWrapper = getConsumerWrapper(this.id, this.getLabel());
        consumerWrapper.textContent = this.getLabel() + ": "
        consumerWrapper.appendChild(this.getDisplayElement())
        return consumerWrapper;
    }

    private getLabel() {
        return this.label ? this.label : "simple-consumer";
    }


}
