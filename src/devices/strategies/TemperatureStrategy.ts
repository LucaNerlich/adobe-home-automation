import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createInputElement, createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * Temperature value interface with unit conversion support
 */
interface TemperatureValue {
    value: number;
    unit: 'C' | 'F';
    target?: number;
}

/**
 * The TemperatureStrategy class extends the Strategy base class and handles temperature controls
 * for smart home devices like HVAC systems, thermostats, water heaters, etc.
 * 
 * It provides:
 * - Number input with unit toggle (°C/°F) for providers
 * - Temperature display with unit and optional target for consumers
 * - Unit conversion between Celsius and Fahrenheit
 * 
 * @readonly {StrategyType} strategyType - The type of the strategy (TEMPERATURE_STRATEGY).
 * @readonly {RegistryService} registryService - The registry service for handling subscriber/publisher model.
 */
export class TemperatureStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.TEMPERATURE_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @method convertTemperature
     * Converts temperature between Celsius and Fahrenheit
     * @param {number} value - Temperature value to convert
     * @param {string} fromUnit - Source unit ('C' or 'F')
     * @param {string} toUnit - Target unit ('C' or 'F')
     * @returns {number} Converted temperature value
     */
    private static convertTemperature(value: number, fromUnit: 'C' | 'F', toUnit: 'C' | 'F'): number {
        if (fromUnit === toUnit) return value
        
        if (fromUnit === 'C' && toUnit === 'F') {
            return (value * 9/5) + 32
        } else if (fromUnit === 'F' && toUnit === 'C') {
            return (value - 32) * 5/9
        }
        
        return value
    }

    /**
     * @method validateTemperatureValue
     * Validates and constrains temperature value to reasonable range
     * @param {number} value - Temperature value to validate
     * @param {string} unit - Temperature unit ('C' or 'F')
     * @returns {number} Valid temperature value
     */
    private static validateTemperatureValue(value: number, unit: 'C' | 'F'): number {
        const min = unit === 'C' ? -50 : -58  // -50°C or -58°F
        const max = unit === 'C' ? 50 : 122   // 50°C or 122°F
        
        return Math.min(Math.max(value, min), max)
    }

    /**
     * @method dispatchEvent
     * Dispatches a custom event with temperature data to relevant consumers.
     * 
     * @param {Event} event - A DOM Event object from the temperature input or unit change
     * @param {...string} args - Topic and randomID arguments
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const form = (event.target as HTMLElement).closest('form')
        
        if (!form) return
        
        const tempInputElement = form.querySelector('input[type="number"]')
        const unitSelectElement = form.querySelector('select')
        
        if (!tempInputElement || !unitSelectElement) return
        
        const tempInput = tempInputElement as HTMLInputElement
        const unitSelect = unitSelectElement as HTMLSelectElement
        
        const value = parseFloat(tempInput.value) || 20
        const unit = unitSelect.value as 'C' | 'F'
        const validatedValue = TemperatureStrategy.validateTemperatureValue(value, unit)
        
        // Update input if value was corrected
        if (validatedValue !== value) {
            tempInput.value = validatedValue.toString()
        }
        
        const temperatureData: TemperatureValue = {
            value: validatedValue,
            unit: unit
        }
        
        const temperatureEvent = createCustomEvent(topic, randomID, temperatureData)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(temperatureEvent)
        })
    }

    /**
     * @method createProviderElement
     * Creates a temperature input with unit selector for HVAC controls.
     * 
     * @param {string} topic - The topic name to create a provider for
     * @param {string} [label] - Optional label (defaults to topic name)
     * @returns {HTMLElement} A form element with temperature input and unit selector
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'temperature-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        // Temperature input
        const inputElement = createInputElement(labelID, 'provider-item-input_' + topic, 'number')
        inputElement.setAttribute('name', label ? label : topic)
        inputElement.setAttribute('value', '20')
        inputElement.setAttribute('min', '-50')
        inputElement.setAttribute('max', '50')
        inputElement.setAttribute('step', '0.5')
        inputElement.style.width = '80px'
        
        // Unit selector
        const unitSelect = document.createElement('select')
        unitSelect.style.marginLeft = '8px'
        unitSelect.style.width = '50px'
        
        const celsiusOption = document.createElement('option')
        celsiusOption.value = 'C'
        celsiusOption.textContent = '°C'
        celsiusOption.selected = true
        unitSelect.appendChild(celsiusOption)
        
        const fahrenheitOption = document.createElement('option')
        fahrenheitOption.value = 'F'
        fahrenheitOption.textContent = '°F'
        unitSelect.appendChild(fahrenheitOption)
        
        // Event listeners
        inputElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))
        unitSelect.addEventListener('change', (event) => {
            // Convert current value to new unit
            const currentValue = parseFloat(inputElement.value) || 20
            const newUnit = (event.target as HTMLSelectElement).value as 'C' | 'F'
            const oldUnit = newUnit === 'C' ? 'F' : 'C'
            const convertedValue = TemperatureStrategy.convertTemperature(currentValue, oldUnit, newUnit)
            
            inputElement.value = Math.round(convertedValue * 10) / 10 + '' // Round to 1 decimal
            inputElement.setAttribute('min', newUnit === 'C' ? '-50' : '-58')
            inputElement.setAttribute('max', newUnit === 'C' ? '50' : '122')
            
            this.dispatchEvent(event, topic, labelID)
        })
        
        formElement.appendChild(inputElement)
        formElement.appendChild(unitSelect)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))
        
        return formElement
    }

    /**
     * @method createConsumerElement
     * Creates a temperature display element showing value and unit.
     * 
     * @param {string} topic - The topic to add the consumer to
     * @param {EventData} eventData - The event data containing the temperature value
     * @returns {HTMLSpanElement} A span element displaying the temperature
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const tempData = eventData.value as TemperatureValue
        
        consumerDisplay.textContent = `${tempData.value}°${tempData.unit}`
        consumerDisplay.style.color = '#e67e22'
        consumerDisplay.style.fontFamily = 'monospace'
        consumerDisplay.style.fontSize = '1.1em'
        consumerDisplay.style.backgroundColor = 'rgba(230, 126, 34, 0.1)'
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
     * Updates the temperature display when a temperature change event is received.
     * 
     * @param {Event} event - A custom event containing the new temperature data
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        const displayElement = this as unknown as HTMLSpanElement
        const tempData = eventData.value as TemperatureValue

        if (displayElement && tempData) {
            displayElement.textContent = `${tempData.value}°${tempData.unit}`
        }
    }
} 