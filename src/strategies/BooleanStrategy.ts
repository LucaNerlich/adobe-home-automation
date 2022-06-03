import {Strategy} from "./Strategy";
import {EventData} from "../entities/EventData";

const classOff = "bool-strategy-off";
const classOn = "bool-strategy-on";

export class BooleanStrategy extends Strategy {
    label: string;

    constructor(label?: string) {
        super();
        this.label = label ? label : "";
    }

    getDisplayElement(eventData: EventData): HTMLSpanElement {
        const state: boolean = BooleanStrategy.parseValue(eventData);
        const consumerDisplay = document.createElement("span");

        BooleanStrategy.setValue(state, consumerDisplay);

        return consumerDisplay;
    }

    private static parseValue(eventData: EventData) {
        return eventData.value;
    }

    private static setValue(state: boolean, consumerDisplay: HTMLSpanElement) {
        if (state) {
            consumerDisplay.textContent = "ON";
            if (consumerDisplay.classList.contains(classOff)) {
                consumerDisplay.classList.remove(classOff)
            }

            consumerDisplay.classList.add(classOn)
        } else {
            consumerDisplay.textContent = "OFF";
            if (consumerDisplay.classList.contains(classOn)) {
                consumerDisplay.classList.remove(classOn)
            }
            consumerDisplay.classList.add(classOff)
        }
    }
}
