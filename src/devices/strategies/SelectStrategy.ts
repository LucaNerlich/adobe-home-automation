import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * The SelectStrategy class extends the Strategy base class and handles dropdown selection controls
 * for smart home devices like mode selection, security states, fan speeds, etc.
 * 
 * It provides:
 * - Dropdown select input for providers
 * - Current selection display for consumers
 * - Predefined option sets for common use cases
 * 
 * @readonly {StrategyType} strategyType - The type of the strategy (SELECT_STRATEGY).
 * @readonly {RegistryService} registryService - The registry service for handling subscriber/publisher model.
 */
export class SelectStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.SELECT_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * Predefined option sets for common smart home use cases
     */
    private static readonly OPTION_SETS = {
        'thermostat-mode': ['Off', 'Heat', 'Cool', 'Auto', 'Eco'],
        'security-mode': ['Disarmed', 'Home', 'Away', 'Night'],
        'fan-speed': ['Off', 'Low', 'Medium', 'High', 'Auto'],
        'light-mode': ['Off', 'Dim', 'Bright', 'Reading', 'Night'],
        'irrigation-zone': ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'All Zones'],
        'music-source': ['Bluetooth', 'Spotify', 'Radio', 'AUX', 'TV'],
        'default': ['Option 1', 'Option 2', 'Option 3']
    }

    /**
     * @method getOptionsForTopic
     * Determines which option set to use based on the topic name
     * @param {string} topic - The topic name
     * @returns {string[]} Array of options for the dropdown
     */
    private static getOptionsForTopic(topic: string): string[] {
        const topicLower = topic.toLowerCase()
        
        if (topicLower.includes('thermostat') || topicLower.includes('hvac')) {
            return SelectStrategy.OPTION_SETS['thermostat-mode']
        } else if (topicLower.includes('security') || topicLower.includes('alarm')) {
            return SelectStrategy.OPTION_SETS['security-mode']
        } else if (topicLower.includes('fan')) {
            return SelectStrategy.OPTION_SETS['fan-speed']
        } else if (topicLower.includes('light') || topicLower.includes('lamp')) {
            return SelectStrategy.OPTION_SETS['light-mode']
        } else if (topicLower.includes('irrigation') || topicLower.includes('sprinkler')) {
            return SelectStrategy.OPTION_SETS['irrigation-zone']
        } else if (topicLower.includes('music') || topicLower.includes('audio')) {
            return SelectStrategy.OPTION_SETS['music-source']
        }
        
        return SelectStrategy.OPTION_SETS['default']
    }

    /**
     * @method dispatchEvent
     * Dispatches a custom event with the selected option to relevant consumers.
     * 
     * @param {Event} event - A DOM Event object from the select change
     * @param {...string} args - Topic and randomID arguments
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const selectElement = event.target as HTMLSelectElement
        
        const selectedValue = selectElement.value
        const selectEvent = createCustomEvent(topic, randomID, selectedValue)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(selectEvent)
        })
    }

    /**
     * @method createProviderElement
     * Creates a dropdown select element for mode/option selection.
     * 
     * @param {string} topic - The topic name to create a provider for
     * @param {string} [label] - Optional label (defaults to topic name)
     * @returns {HTMLElement} A form element with select dropdown and controls
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'select-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        // Create select element
        const selectElement = document.createElement('select')
        selectElement.id = labelID
        selectElement.setAttribute('data-attribute', 'provider-item-input_' + topic)
        selectElement.setAttribute('name', label ? label : topic)
        
        // Get appropriate options for this topic
        const options = SelectStrategy.getOptionsForTopic(topic)
        
        // Add options to select
        options.forEach((optionText, index) => {
            const optionElement = document.createElement('option')
            optionElement.value = optionText
            optionElement.textContent = optionText
            if (index === 0) optionElement.selected = true // Select first option by default
            selectElement.appendChild(optionElement)
        })
        
        selectElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        
        formElement.appendChild(selectElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        
        return formElement
    }

    /**
     * @method createConsumerElement
     * Creates a display element that shows the currently selected option.
     * 
     * @param {string} topic - The topic to add the consumer to
     * @param {EventData} eventData - The event data containing the selected value
     * @returns {HTMLSpanElement} A span element displaying the selection
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const selectedValue = String(eventData.value)
        
        consumerDisplay.textContent = selectedValue
        consumerDisplay.style.fontWeight = '500'
        consumerDisplay.style.color = '#4a90e2'
        consumerDisplay.style.backgroundColor = 'rgba(74, 144, 226, 0.1)'
        consumerDisplay.style.padding = '4px 8px'
        consumerDisplay.style.borderRadius = '4px'
        consumerDisplay.style.display = 'inline-block'
        consumerDisplay.style.marginLeft = '8px'

        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

    /**
     * @method update
     * Updates the selection display when a new option is selected.
     * 
     * @param {Event} event - A custom event containing the new selection data
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            const selectedValue = String(eventData.value)
            displayElement.textContent = selectedValue
        }
    }
} 