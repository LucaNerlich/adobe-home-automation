import {EventData} from '../../entities/EventData'

/*
todo how to handle "composite" devices ->
     devices that may need more than one "handle this Event" implementation
*/
/**
 * A strategy encapsulates a specific use case and handles the corresponding provider and consumer.
 * A provider broadcasts its value changes via a custom event and a specific topic.
 * A consumer listens on this topic and updates its internal implementation,
 * which in return visualizes the updated value.
 */
export abstract class Strategy {

    abstract strategyType: StrategyType

    /**
     * Mocks a real display / api from a smart home device
     * returns the element that visualizes the given value
     */
    abstract createConsumerElement(topic: string, eventData: EventData): HTMLElement;

    /**
     * Creates and returns a provider wrapper from (e.g input field)
     */
    abstract createProviderElement(topic: string, label?: string): HTMLElement;

    /**
     * @param event -> dispatches data for its topic
     */
    abstract dispatchEvent(event: Event): void;

    /**
     * Updates the underlying div that represents the display / api for implementing strategy
     * @param this -> (implicit) the HTMLElement to update
     * @param event -> event and data sent by provider
     */
    abstract update(event: Event): void;
}

export enum StrategyType {
    BOOLEAN_STRATEGY = 'BOOLEAN_STRATEGY',
    NUMBER_STRATEGY = 'NUMBER_STRATEGY'
}
