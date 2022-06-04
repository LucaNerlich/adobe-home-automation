import {EventData} from '../entities/EventData'

/*
todo how to handle "composite" devices ->
     devices that may need more than one "handle this Event" implementation
*/
export abstract class Strategy {

    // todo do we need the strat label?
    abstract label?: string

    /**
     * Mocks a real display / api from a smart home device
     * returns the element that visualizes the given value
     */
    abstract getDisplayElement(eventData: EventData): HTMLElement;
}
