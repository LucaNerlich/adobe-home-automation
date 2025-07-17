import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * The ColorStrategy class extends the Strategy base class and handles color-related controls
 * for smart home devices like RGB lights, LED strips, etc.
 * 
 * It provides:
 * - Color picker input for providers
 * - Color swatch display for consumers
 * - Hex color value handling with validation
 * 
 * @readonly {StrategyType} strategyType - The type of the strategy (COLOR_STRATEGY).
 * @readonly {RegistryService} registryService - The registry service for handling subscriber/publisher model.
 */
export class ColorStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.COLOR_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @method validateColorValue
     * Validates that the input is a valid hex color code
     * @param {string} value - The color value to validate
     * @returns {string} - Valid hex color or default white
     */
    private static validateColorValue(value: string): string {
        // Remove # if present and validate hex pattern
        const hexValue = value.replace('#', '')
        const hexPattern = /^[0-9A-Fa-f]{6}$/
        
        if (hexPattern.test(hexValue)) {
            return '#' + hexValue.toLowerCase()
        }
        
        return '#ffffff' // Default to white if invalid
    }

    /**
     * @method dispatchEvent
     * Dispatches a custom event with color data to relevant consumers.
     * 
     * @param {Event} event - A DOM Event object from the color input change
     * @param {...string} args - Topic and randomID arguments
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const colorInput = event.target as HTMLInputElement
        
        const validatedColor = ColorStrategy.validateColorValue(colorInput.value)
        colorInput.value = validatedColor // Update input with validated color
        
        const colorEvent = createCustomEvent(topic, randomID, validatedColor)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(colorEvent)
        })
    }

    /**
     * @method createProviderElement
     * Creates a color picker input element for controlling smart lights.
     * 
     * @param {string} topic - The topic name to create a provider for
     * @param {string} [label] - Optional label (defaults to topic name)
     * @returns {HTMLElement} A form element with color picker and controls
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'color-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'color')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('value', '#ffffff') // Default to white
        
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        
        formElement.appendChild(inputElement)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        
        return formElement
    }

    /**
     * @method createConsumerElement
     * Creates a color swatch display element that shows the current color.
     * 
     * @param {string} topic - The topic to add the consumer to
     * @param {EventData} eventData - The event data containing the color value
     * @returns {HTMLSpanElement} A span element displaying the color
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const colorValue = ColorStrategy.validateColorValue(String(eventData.value))
        
        // Create a color swatch with the color value
        consumerDisplay.style.backgroundColor = colorValue
        consumerDisplay.style.border = '2px solid #ccc'
        consumerDisplay.style.borderRadius = '4px'
        consumerDisplay.style.width = '60px'
        consumerDisplay.style.height = '30px'
        consumerDisplay.style.display = 'inline-block'
        consumerDisplay.style.marginLeft = '8px'
        consumerDisplay.textContent = colorValue
        consumerDisplay.style.textAlign = 'center'
        consumerDisplay.style.lineHeight = '30px'
        consumerDisplay.style.fontSize = '0.8em'
        consumerDisplay.style.color = colorValue === '#000000' ? '#fff' : '#000'

        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

    /**
     * @method update
     * Updates the color swatch display when a color change event is received.
     * 
     * @param {Event} event - A custom event containing the new color data
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        const displayElement = this as unknown as HTMLSpanElement

        if (displayElement) {
            const colorValue = ColorStrategy.validateColorValue(String(eventData.value))
            displayElement.style.backgroundColor = colorValue
            displayElement.textContent = colorValue
            displayElement.style.color = colorValue === '#000000' ? '#fff' : '#000'
        }
    }
} 