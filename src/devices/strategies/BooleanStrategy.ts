import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {getRandomID} from '../../constants'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

const classOff = 'bool-strategy-off'
const classOn = 'bool-strategy-on'


/**
 * @class BooleanStrategy
 * @extends {Strategy}
 * Primary object responsible for providing 'boolean-like' behaviour to certain aspects along with embedded methods "dispatchEvent",
 * "createProviderElement", and "createConsumerElement", and "update".
 *
 * @property {StrategyType} strategyType - Reflects the exact type of strategy being employed.
 * @property {Service} registryService - Facilitates interaction with registry services (like registration or removal of a topic).
 *
 * @method dispatchEvent(event: Event, ...args: string[]): Dispatches an event to consumers registered under a particular topic.
 * @method createProviderElement(topic: string, label?: string): HTMLElement: Creates a provider's form element.
 * @method createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement: Responsible for creating, modifying,
 * and returning an HTMLSpanElement containing current event data state.
 * @method update(event: Event): void: Updates the display state of the consumer according to the information received from the event.
 */
export class BooleanStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.BOOLEAN_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @static
     * @method parseValue(eventData: EventData): boolean
     *
     * A static utility method that determines if the provided `eventData` value is truthy not only in a traditional boolean sense
     * but also considering certain numeric values and string representations of a boolean value.
     * Here it considers a value truthy if it's greater than or less than zero, or if it's a string 'true' or a boolean `true`.
     *
     * @param {EventData} eventData - The EventData object from which value is extracted.
     * @returns {boolean} - Returns `true` if the conditions are met, `false` otherwise.
     */
    private static parseValue(eventData: EventData) {
        return (
            (eventData.value > 0 || eventData.value < 0) ||
            (eventData.value === 'true') ||
            (eventData.value === true)
        )
    }

    /**
     * @static
     * @method setValue(state: boolean, consumerDisplay: HTMLSpanElement)
     *
     * A static function that changes the visual state of a consumer display element depending on the provided state.
     * If state is true, it sets the text content of consumerDisplay to 'ON', removes the `classOff` (if present) and adds `classOn`.
     * If state is false, it sets the text content of consumerDisplay to 'OFF', removes the `classOn` (if present) and adds `classOff`.
     *
     * @param {boolean} state - The state to be reflected in the consumerDisplay: 'ON' if true, 'OFF' if false.
     * @param {HTMLSpanElement} consumerDisplay - The element whose display state is to be updated.
     */
    private static setValue(state: boolean, consumerDisplay: HTMLSpanElement) {
        if (state) {
            consumerDisplay.textContent = 'ON'
            if (consumerDisplay.classList.contains(classOff)) {
                consumerDisplay.classList.remove(classOff)
            }

            consumerDisplay.classList.add(classOn)
        } else {
            consumerDisplay.textContent = 'OFF'
            if (consumerDisplay.classList.contains(classOn)) {
                consumerDisplay.classList.remove(classOn)
            }
            consumerDisplay.classList.add(classOff)
        }
    }

    /**
     * Dispatches an Event along with additional arguments to consumers registered under a specific topic. The method begins by unpacking the arguments
     * to a topic and a randomID. Then, a reference to the checkboxElement is obtained from the event's target which may be undefined.
     * A custom event is created with the topic, randomID, and the checked status of the checkboxElement and subsequently dispatched to each consumer found
     * from a given topic.
     *
     * @param {Event} event - The event object.
     * @param {...string[]} args - Additional arguments passed to the function where the first argument is a topic and the second one is a randomID.
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const checkboxElement = event.target as HTMLInputElement
        const checkboxEvent = createCustomEvent(topic, randomID, checkboxElement?.checked)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(checkboxEvent)
        })
    }

    /**
     * This method, 'createProviderElement', is used to create a form element for a specific provider. It first generates unique
     * identifiers for the form and its label element.
     * It then creates a base form and a label element by calling the 'createBaseForm' and 'createLabelElement' functions respectively,
     * and appends the label element to the form element. It continues to create an input element of type 'checkbox' and then associates it
     * with the label by setting the input element's id to match the label's id.
     * It also adds an event listener for the change events, and when a change event is triggered, it dispatches the event with some provided parameters.
     * Afterwards, it appends the input element and a deletion button (by calling 'createDeletionButton') to the form element.
     * This deletion button, when clicked, removes the topic from the registry service.
     * Finally, it returns the complete form element.
     *
     * @param {string} topic - The topic associated with the form.
     * @param {string} [label] - An optional label for the form, defaults to the topic if not provided.
     * @returns {HTMLElement} - Returns the complete form element.
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'bool-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'checkbox')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        return formElement
    }

    /**
     * @method createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement
     *
     * Responsible for creating a 'consumer' HTML span element according to the provided `topic` and `eventData`,
     * then assigning it a particular state, and assigning an event listener to it.
     * Afterwards, it registers the newly created 'consumer' HTML span element with the `registryService`.
     * Finally, it returns this 'consumer' HTML span element.
     *
     * @param {string} topic - The topic for which the consumer element is created.
     * @param {EventData} eventData - The EventData object which is used to determine the initial state of the consumer span element.
     *
     * @returns {HTMLSpanElement} consumerDisplay - The span element created, with a state determined from `eventData`, listening to events on `topic`,
     * and added to the registry service as a consumer of `topic`.
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const state: boolean = BooleanStrategy.parseValue(eventData)
        const consumerDisplay = document.createElement('span')

        BooleanStrategy.setValue(state, consumerDisplay)

        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

        /**
         * @method update(event: Event): void
         *
         * Updates the display state of the consumer element according to the information received from the `Event`.
         * It starts by getting the `EventData` details from the event and forcibly typecasts 'this' to a `HTMLSpanElement`.
         * Then it checks if this `displayElement` exists. If it does, it calls the static method `setValue` of 'BooleanStrategy' to parse `EventData`.
         * and update the display state of the `displayElement` accordingly.
         *
         * @param {Event} event - A custom `Event` object containing `EventData` in its `detail` property.
         */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        // force typecast
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            BooleanStrategy.setValue(BooleanStrategy.parseValue(eventData), displayElement)
        }
    }
}
