import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * The TimeStrategy class extends the Strategy base class and handles time controls
 * for smart home devices like automation schedules, timers, countdown functionality.
 * 
 * It provides:
 * - Time input field for providers
 * - Formatted time display for consumers
 * - 24-hour format support
 * 
 * @readonly {StrategyType} strategyType - The type of the strategy (TIME_STRATEGY).
 * @readonly {RegistryService} registryService - The registry service for handling subscriber/publisher model.
 */
export class TimeStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.TIME_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @method validateTimeValue
     * Validates that the input is a valid time format (HH:MM)
     * @param {string} value - Time value to validate
     * @returns {string} Valid time value or default
     */
    private static validateTimeValue(value: string): string {
        const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
        
        if (timePattern.test(value)) {
            return value
        }
        
        return '00:00' // Default to midnight if invalid
    }

    /**
     * @method formatTimeDisplay
     * Formats time for display with optional 12/24 hour format
     * @param {string} timeValue - Time in HH:MM format
     * @param {boolean} is24Hour - Whether to use 24-hour format
     * @returns {string} Formatted time string
     */
    private static formatTimeDisplay(timeValue: string, is24Hour: boolean = true): string {
        if (!timeValue || timeValue === '00:00') {
            return is24Hour ? '00:00' : '12:00 AM'
        }
        
        if (is24Hour) {
            return timeValue
        }
        
        // Convert to 12-hour format
        const [hours = 0, minutes = 0] = timeValue.split(':').map(Number)
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }

    /**
     * @method dispatchEvent
     * Dispatches a custom event with time data to relevant consumers.
     * 
     * @param {Event} event - A DOM Event object from the time input
     * @param {...string} args - Topic and randomID arguments
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const timeInput = event.target as HTMLInputElement
        
        const validatedTime = TimeStrategy.validateTimeValue(timeInput.value)
        timeInput.value = validatedTime // Update input with validated time
        
        const timeEvent = createCustomEvent(topic, randomID, validatedTime)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(timeEvent)
        })
    }

    /**
     * @method createProviderElement
     * Creates a time input element for setting schedules and timers.
     * 
     * @param {string} topic - The topic name to create a provider for
     * @param {string} [label] - Optional label (defaults to topic name)
     * @returns {HTMLElement} A form element with time input
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'time-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'time')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('value', '00:00')
        inputElement.style.width = '120px'
        
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        
        return formElement
    }

    /**
     * @method createConsumerElement
     * Creates a time display element showing the current time value.
     * 
     * @param {string} topic - The topic to add the consumer to
     * @param {EventData} eventData - The event data containing the time value
     * @returns {HTMLSpanElement} A span element displaying the time
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const timeValue = String(eventData.value)
        const validatedTime = TimeStrategy.validateTimeValue(timeValue)
        
        consumerDisplay.textContent = TimeStrategy.formatTimeDisplay(validatedTime, true)
        consumerDisplay.style.color = '#8e44ad'
        consumerDisplay.style.fontFamily = 'monospace'
        consumerDisplay.style.fontSize = '1.1em'
        consumerDisplay.style.backgroundColor = 'rgba(142, 68, 173, 0.1)'
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
     * Updates the time display when a time change event is received.
     * 
     * @param {Event} event - A custom event containing the new time data
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        const displayElement = this as unknown as HTMLSpanElement
        const timeValue = String(eventData.value)

        if (displayElement) {
            const validatedTime = TimeStrategy.validateTimeValue(timeValue)
            displayElement.textContent = TimeStrategy.formatTimeDisplay(validatedTime, true)
        }
    }
} 