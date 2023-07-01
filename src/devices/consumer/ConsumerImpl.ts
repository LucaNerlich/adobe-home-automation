import {Consumer} from './Consumer'
import {Strategy} from '../strategies/Strategy'
import {getRandomID} from '../../constants'
import {createDeletionButton, replaceSpaceWithDash} from '../../domUtils'
import {useRegistryService} from '../RegistryService'

/**
 * The `ConsumerImpl` class extends the `Consumer` class. This class mocks an IoT devices API in a home automation setting
 * and provides a mock consumer in the form of an HTMLElement, such as a lightbulb or temperature display of a heating device.
 *
 * Class attributes:
 * @property id - The unique identifier for this consumer
 * @property label - A label that describes this consumer
 * @property topic - The communication topic this consumer is associated with
 * @property strategy - The strategy object used for creating consumer elements
 * @property registryService - A singleton instance of a registryService used for removing the consumer if needed
 *
 * The primary methods of the `ConsumerImpl` class are:
 * - getConsumerWrapper(): Returns a generic wrapper around every consumer item as a simple div.
 * - getElement(): Returns the HTML element associated with this consumer; also adds the deletion button and a topic hint.
 * - getDisplayElement(): Returns the specific display element created using the strategy.
 * - getLabel(): Returns a label for the consumer, defaults to 'simple-consumer' if no label is provided.
 */
export class ConsumerImpl extends Consumer {
    id: string
    label: string
    topic: string
    strategy: Strategy

    readonly registryService = useRegistryService()

    constructor(topic: string, label: string, strategy: Strategy) {
        super()
        this.id = getRandomID()
        this.topic = replaceSpaceWithDash(topic)
        this.label = label
        this.strategy = strategy
    }

    /**
     * This static method generates and returns an HTMLElement that serves as a generic wrapper for consumer items.
     *
     * @method getConsumerWrapper
     * @static
     * @param {string} id - An unique identifier (UUID) assigned to the consumer item.
     * @param {string} [label] - An optional parameter which, if specified, is used to add a 'data-label' attribute to the consumer item.
     * @returns {HTMLElement} An HTML div element with the provided 'id', a 'consumer-item' class, and, if provided, a 'data-label' attribute with the
     * value of 'label'.
     */
    private static getConsumerWrapper(id: string, label?: string): HTMLElement {
        const consumerRootContainer = document.createElement('div')
        consumerRootContainer.id = id
        consumerRootContainer.classList.add('consumer-item')

        if (label && label.length > 0) {
            consumerRootContainer.setAttribute('data-label', label)
        }

        return consumerRootContainer
    }

    /**
     * This method generates and returns an HTMLElement that represents the consumer object. It starts by creating a new `consumerWrapper`
     * by calling the getConsumerWrapper method. It adds a CSS class string, composed of the base `consumer-item` string and strategy
     * type of the consumer. It sets the element's text content to the consumer's label and appends the display element to `consumerWrapper`.
     * Afterward, it creates a new `topicHint` element and sets the text content to the current topic of the consumer.
     * It then appends a `DeletionButton` to the `consumerWrapper` before appending the `topicHint` element.
     * It returns `consumerWrapper` as the result.
     *
     * @returns {HTMLElement} - The HTML element associated with this Consumer item.
     */
    getElement(): HTMLElement {
        const consumerWrapper = ConsumerImpl.getConsumerWrapper(this.id, this.getLabel())
        consumerWrapper.classList.add(`consumer-item-${this.strategy.strategyType}`)
        consumerWrapper.textContent = this.getLabel() + ': '
        consumerWrapper.appendChild(this.getDisplayElement())

        const topicHint = document.createElement('p')
        topicHint.textContent = this.topic
        consumerWrapper.appendChild(createDeletionButton(this.id, () => {
            this.registryService.removeConsumer(this.topic)
        }))
        consumerWrapper.appendChild(topicHint)
        return consumerWrapper
    }

    /**
     * This private method `getDisplayElement` creates and returns an HTMLElement, which is a specific display element using the
     * attached strategy. The created consumer element is associated with the defined `topic`, `id`, and `label`. The `value` property
     * is always set to `false` in the created consumer element.
     *
     * @method getDisplayElement
     * @returns {HTMLElement} - The consumer HTML element specific to a particular Strategy.
     */
    private getDisplayElement(): HTMLElement {
        return this.strategy.createConsumerElement(this.topic, {
            label: this.label,
            id: this.id,
            value: false,
        })
    }

    /**
         * getLabel is a private method that returns the label for the ConsumerImpl object.
         * If no label is provided, the method will default to returning 'simple-consumer'.
         *
         * @returns {string} The label of the ConsumerImpl object or 'simple-consumer' if no label is provided.
         */
    private getLabel() {
        return this.label ? this.label : 'simple-consumer'
    }
}
