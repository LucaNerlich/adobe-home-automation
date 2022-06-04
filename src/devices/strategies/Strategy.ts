import {EventData} from '../../entities/EventData'

/*
todo how to handle "composite" devices ->
     devices that may need more than one "handle this Event" implementation
*/
export abstract class Strategy {

    /**
     * Mocks a real display / api from a smart home device
     * returns the element that visualizes the given value
     */
    abstract createDisplayElement(eventData: EventData): HTMLElement;

    /**
     * Updates the underlying div that represents the display / api for implementing strategy
     * @param this -> (implicit) the div to update
     * @param event -> event and data sent by provider
     */
    abstract update(event: Event): void;
}
