import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'


/**
 * The NumberStrategy class, which extends the Strategy base class, mainly focuses on handling number related strategies.
 * It holds a type of the strategy and a reference to the registry service.
 *
 * @readonly {StrategyType} strategyType - The type of the strategy.
 * @readonly {RegistryService} registryService - The registry service for handling the subscriber/publisher model.
 *
 * Methods:
 * dispatchEvent(event: Event, ...args: string[]): Handles the dispatching of events to consumers.
 *   @param {Event} event - The event that has been triggered.
 *   @param {...string} args - Additional arguments.
 *
 * createProviderElement(topic: string, label?: string): Creates a provider element based on certain rules.
 *   @param {string} topic - The topic to add the consumer to.
 *   @param {string} [label] - Optional label to attach to the new HTML element.
 *   @return {HTMLElement} - A form element ready to be placed in a form.
 *
 * createConsumerElement(topic: string, eventData: EventData): Creates a consumer element for the specified topic.
 *   @param {string} topic - The topic to add the consumer to.
 *   @param {EventData} eventData - The event data to use in the creation of the consumer.
 *   @return {HTMLSpanElement} - A span element to be added as a consumer to the registry.
 *
 * update(event: Event): Updates the element's value based on the event's detail.
 *   @param {Event} event - The event that triggers the update.
 */
export class NumberStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.NUMBER_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @method dispatchEvent
     * Dispatches a custom event to the relevant consumers associated with a topic.
     *
     * @param {Event} event - A DOM Event object, typically a 'change' event resulting from interactions with the input field.
     * @param {...string} args - A spread array of string arguments. The first argument should be a topic string
     * and the second argument a random identifier associated with the input field. Further arguments will be ignored.
     *
     * The function works as follows:
     * 1. It extracts the topic and randomID from the args array.
     * 2. It retrieves the input element's value responsible for the event triggering and assigns it into the numberField variable.
     * 3. It creates a custom event (checkboxEvent) using the topic, randomID, and the value of the numberField.
     * 4. It retrieves a list of consumers associated with the topic from the registry service.
     * 5. It dispatches the custom event (checkboxEvent) to each consumer in the list.
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const numberField = event.target as HTMLInputElement
        const checkboxEvent = createCustomEvent(topic, randomID, numberField?.valueAsNumber)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(checkboxEvent)
        })
    }

    /**
     * @method createProviderElement
     * This method generates an HTML element that provides a user interface for dealing with number strategies.
     *
     * @param {string} topic - The topic name to create a provider for.
     * @param {string} [label] - An optional parameter for setting an alternative label for the topic (defaults to the topic name if not provided).
     *
     * The function performs the following procedures:
     * 1. It generates two unique identifiers using the getRandomID() function. These are used as the ID for the form and the label respectively.
     * 2. It creates the base form element through the createBaseForm() function, with the previously generated formId and a strategy type of 'number-strategy'.
     * 3. It generates a label element based on the given topic (or label) and appends it to the form element.
     * 4. It creates an input element which is associated with the above label, has additional set attributes, and an event listener
     * that dispatches a change event to relevant consumers. The input element is then appended to the form element.
     * 5. It attaches a button that upon clicking removes the topic from the registry service. The button is then, likewise, appended to the form.
     *
     * @returns {HTMLElement} A completed form element that contains input, label, and button elements.
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'number-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'number')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('min', '0')
        inputElement.setAttribute('max', '1')
        inputElement.setAttribute('step', '0.1')
        inputElement.setAttribute('placeholder', '% max. value')
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        return formElement
    }

    /**
     * @method createConsumerElement
     * This method creates an HTML span element that functions as a consumer for a specified topic.
     *
     * @param {string} topic - The topic to add the consumer to.
     * @param {EventData} eventData - The event data to use in the creation of the consumer.
     *
     * The function performs the following procedures:
     * 1. It creates a 'span' element that later displays the consumer's value.
     * 2. It obtains a numerical representation of the 'eventData' parameter.
     *    - If the number is valid, it's converted to a string representation and assigned to the span text content.
     *    - If not valid (NaN), the 'span' text content is set as 'N/A' (Not Available).
     * 3. It adds an event listener to the created 'span' element, which triggers the 'update' method on recept of an event
     *    associated with the 'topic'.
     * 4. The 'span' is then registered as a consumer to the 'topic' in the registry through the 'registryService'.
     *
     * @return {HTMLSpanElement} - A span element that can consume data from certain events.
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value: number = parseFloat(eventData.value)
        if (!isNaN(value)) {
            consumerDisplay.textContent = value.toString()
        } else {
            // set default
            consumerDisplay.textContent = 'N/A'
        }

        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

    /**
     * @method update
     * The function updates the HTML element's text content based on the event's detail.
     *
     * @param {Event} event - A DOM Event object, typically a custom event triggered by a provider interacting with data updates.
     *
     * The function performs the following procedures:
     * 1. It first extracts the detail out of the custom event.
     *      - The detail is the EventData, which is given an enforced typecast within this function.
     * 2. It then typecasts 'this', the callee, into the type of HTMLSpanElement, forcefully by first transforming into the type 'unknown'.
     *      - This is because TypeScript does not allow direct conversion of supertype to a subtype without going through the 'unknown' type first.
     * 3. If the HTMLElement (displayElement) exists, then its text content is updated using the value property extracted from the EventData object.
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData

        // force typecast
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            displayElement.textContent = eventData.value
        }
    }
}
