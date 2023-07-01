import {EventData} from '../../entities/EventData'
import {StrategyType} from './StrategyType'

/**
 * This TypeScript class is named Strategy and is abstract.
 * @remarks
 * - It encapsulates a specific use case and handles the corresponding provider and consumer.
 * - A provider broadcasts its value changes via a custom event and a specific topic.
 * - A consumer listens on this topic and updates its implementation,
 *   which in return visualizes the updated value.
 * @property strategyType - The type of strategy. It's abstract and has to be implemented by sub-classes.
 * @method createConsumerElement - Mocks a real display / api from a smart home device,
 *   returning the element that visualizes the given value. It should handle EventData.value types.
 * @method createProviderElement - Creates and returns a provider wrapper from, for example, an input field.
 * @method dispatchEvent - Dispatches data for its topic. Can accept additional data such as topic or id.
 * @method update - Updates the underlying div that represents the display / api for the implemented strategy.
 */
export abstract class Strategy {

    abstract strategyType: StrategyType

    /**
     * Mocks a real display / api from a smart home device
     * returns the element that visualizes the given value.
     * Needs to handle incoming types of EventData.value
     */
    abstract createConsumerElement(topic: string, eventData: EventData): HTMLElement;

    /**
     * Creates and returns a provider wrapper from (e.g input field)
     */
    abstract createProviderElement(topic: string, label?: string): HTMLElement;

    /**
     * @param event -> dispatches data for its topic
     * @param args -> additional data such as topic or id
     */
    abstract dispatchEvent(event: Event, ...args: string[]): void;

    /**
     * Updates the underlying div that represents the display / api for implementing strategy
     * //@param this -> (implicit) the HTMLElement to update
     * @param event -> event and data sent by provider
     */
    abstract update(event: Event): void;
}
