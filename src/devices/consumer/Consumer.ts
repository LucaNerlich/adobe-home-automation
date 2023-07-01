import {Strategy} from '../strategies/Strategy'

/**
 * The Consumer class is an abstract class that represents a general concept of a consumer.
 * Each consumer has an ID, label and strategy, and is assigned a topic of interest.
 *
 * Fields:
 * - id: A string representing the unique identifier of the consumer.
 * - label: A string representing the label of the consumer.
 * - topic: A string representing the topic the consumer subscribes to.
 * - strategy: A Strategy object encapsulating the strategy the consumer utilizes.
 *
 * Methods:
 * - getElement(): A method that returns an HTMLElement associated with the consumer.
 */
export abstract class Consumer {
    abstract id: string
    abstract label: string
    abstract topic: string
    abstract strategy: Strategy

    abstract getElement(): HTMLElement;
}
