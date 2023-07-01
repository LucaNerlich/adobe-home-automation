import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {getRandomID} from '../../constants'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * Class TextStrategy manages the information flow between providers and consumers for text-based strategies.
 *
 * @extends Strategy
 * @property {StrategyType} strategyType - Defines the type of strategy. In this case, TEXT_STRATEGY.
 * @property {service} registryService - Service used for adding, fetching, and deleting topics in the registry.
 *
 * @method createConsumerElement - Creates an element that consumes the EventData and updates the text content of the element
 *                                  based on the EventData value. The element color is set to 'blue'.
 *
 * @method createProviderElement - Creates a provider element in form of form input. If label is not given, label will be set as topic.
 *                                  It provides a way to dispatch an event on user input. It also has a deletion button which
 *                                  removes the topic from the registry service.
 *
 * @method dispatchEvent - Dispatches events to all registered consumers for the specific topic.
 *
 * @method update - Updates the display content based on the event detail when an event is dispatched. Display Element is a
 *                    HTMLSpanElement type casted from 'this'.
 */
export class TextStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.TEXT_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * Method createConsumerElement creates an HTMLElement that consumes the EventData and updates the
     * text content of the element based on the EventData value. It also adds an event listener to the created
     * element for the provided topic that triggers the update method when such an event occurs. Finally,
     * it adds the created element as a consumer to the registry service for the given topic.
     *
     * @param {string} topic - The topic which this consumer element is related to.
     * @param {EventData} eventData - The data which the consumer element initially displays.
     *
     * @return {HTMLElement} - The created HTMLElement consuming data for the provided topic.
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLElement {
        const consumerDisplay = document.createElement('span')
        consumerDisplay.textContent = eventData.value
        consumerDisplay.style.color = 'blue'
        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

    /**
     * Method createProviderElement creates an HTMLElement for input fields. This method provides input fields for respective topics.
     * If a label for the given topic is not provided, the topic itself is used as the label. It sets up a listener for the 'input' event
     * and dispatches a new event with the given topic and labelID as arguments upon any changes in the input field.
     * It also manages the deletion of the topics from the registry service by attaching a deletion button to the created
     * form and setting up a listener for the click event on the button. The listener fires a callback function which
     * removes the respective topic when the button is clicked.
     *
     * @param {string} topic - The topic for which this providr element is related to.
     * @param {string} [label] - The label to be shown for input field. If not provided, topic is used as label.
     *
     * @return {HTMLElement} - The created HTMLElement with a form housing the topic related input.
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formID = getRandomID()
        const form = createBaseForm(formID, 'text-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        form.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'text')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('placeholder', 'some led display')
        inputElement.addEventListener('input', (event) => this.dispatchEvent(event, topic, labelID))
        form.appendChild(inputElement)

        form.appendChild(createDeletionButton(formID, () => {
            this.registryService.removeTopic(topic)
        }))

        return form
    }

    /**
     * Dispatches the event passed and any other arguments that follow initial event.
     *
     * @param {Event} event - The initial event that originates the dispatch.
     * @param {...string[]} args - Extra arguments that follow the event.
     * @returns {void} - The function doesn't return anything.
     *
     * This method begins by assigning the event target to a variable textField, then creates a custom event using the topic,
     * randomID, and the value of textField. The method gets all consumers from the registry service that listen to the said topic
     * and then dispatches the custom event to each consumer.
     */
    dispatchEvent(event: Event, ...args: string[]): void {
        const topic = args[0] as string
        const randomID = args[1] as string
        const textField = event.target as HTMLInputElement
        const changeEvent = createCustomEvent(topic, randomID, textField?.value)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(changeEvent)
        })
    }

    /**
     * The update function is a method of the 'TextStrategy' class.
     *
     * @param event - The CustomEvent instance that has been dispatched by the provider. The detail property of this event is cast to an
     *                EventData, which is an object that carries data about the event, specifically the value that should be displayed.
     *
     * The function casts 'this' to a HTMLSpanElement and stores it in 'displayElement'. 'this', in context of this function, refers to the
     * instance of TextStrategy's class whose 'update' method was called as part of event listener's callback execution. Strictly, it is
     * related to the 'createConsumerElement' method, where the event listener is added.
     *
     * If 'displayElement' (i.e., 'this') is not null, it updates the 'textContent' of 'displayElement' with the 'value' stored in 'eventData'.
     *
     * @return void - The function doesn't return anything.
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
