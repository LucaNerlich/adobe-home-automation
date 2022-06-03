import {Strategy} from "./Strategy";
import {EventData} from "../entities/EventData";
import {getConsumerWrapper} from "../domUtils";

export class BooleanStrategy extends Strategy {
    label: string;

    constructor(label?: string) {
        super();
        this.label = label ? label : "";
    }

    getDisplayElement(eventData: EventData): HTMLElement {
        const state: boolean = BooleanStrategy.parseValue(eventData);
        const consumerWrapper = getConsumerWrapper(eventData.label);
        const consumerDisplay = document.createElement("div");

        BooleanStrategy.setValue(state, consumerDisplay);

        return consumerWrapper.appendChild(consumerDisplay);
    }

    private static parseValue(eventData: EventData) {
        return eventData.value;
    }

    private static setValue(state: boolean, consumerDisplay: HTMLDivElement) {
        if (state) {
            consumerDisplay.textContent = "ON";
            if (consumerDisplay.classList.contains("bool-strategy-off")) {
                consumerDisplay.classList.remove("bool-strategy-off")
            }

            consumerDisplay.classList.add("bool-strategy-on")
        } else {
            consumerDisplay.textContent = "OFF";
            if (consumerDisplay.classList.contains("bool-strategy-on")) {
                consumerDisplay.classList.remove("bool-strategy-on")
            }
            consumerDisplay.classList.add("bool-strategy-off")
        }
    }
}
