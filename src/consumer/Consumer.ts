import {EventData} from "../entities/EventData";

export class Consumer {
    label: string;
    display: HTMLElement;

    // todo handle "strategy pattern"?

    constructor(label: string, eventData: EventData) {
    }
}
