import {Consumer} from "./Consumer";
import {Strategy} from "../strategies/Strategy";
import {getConsumerWrapper} from "../domUtils";

export class SimpleConsumer extends Consumer {
    label: string;
    _strategy: Strategy;
    update: Function;

    constructor(label: string, strategy: Strategy, eventCallback: Function) {
        super();
        this.label = label;
        this._strategy = strategy;
        this.update = eventCallback
    }

    getDisplayElement(): HTMLElement {
        // initialize with default data
        return this._strategy.getDisplayElement({
            label: "Kitchen Light Switch",
            id: this.id,
            value: false,
        });
    }

    getElement(): HTMLElement {
        const consumerWrapper = getConsumerWrapper(this.getLabel());
        consumerWrapper.classList.add(this.getLabel())
        consumerWrapper.textContent = this.getLabel() + ": "
        consumerWrapper.appendChild(this.getDisplayElement())
        return consumerWrapper;
    }

    private getLabel() {
        return this.label ? this.label : "simple-consumer";
    }


}
