import {Strategy} from './Strategy'
import {EventData} from '../../entities/EventData'
import {getRandomID} from '../../constants'
import {createBaseForm, createCustomEvent, createDeletionButton} from '../../domUtils'
import {createLabelElement} from '../FormService'
import {useRegistryService} from '../RegistryService'
import {StrategyType} from './StrategyType'

/**
 * The SliderStrategy class extends the Strategy base class and handles range/slider controls
 * for smart home devices like volume controls, brightness, speed, etc.
 *
 * It provides:
 * - Range slider input for providers
 * - Progress bar with percentage display for consumers
 * - Real-time visual feedback
 *
 * @readonly {StrategyType} strategyType - The type of the strategy (SLIDER_STRATEGY).
 * @readonly {RegistryService} registryService - The registry service for handling subscriber/publisher model.
 */
export class SliderStrategy extends Strategy {
    readonly strategyType: StrategyType = StrategyType.SLIDER_STRATEGY
    readonly registryService = useRegistryService()

    /**
     * @method validateSliderValue
     * Validates and constrains slider value to 0-100 range
     * @param {number} value - Slider value to validate
     * @returns {number} Valid slider value (0-100)
     */
    private static validateSliderValue(value: number): number {
        return Math.min(Math.max(Math.round(value), 0), 100)
    }

    /**
     * @method dispatchEvent
     * Dispatches a custom event with slider value to relevant consumers.
     *
     * @param {Event} event - A DOM Event object from the range input
     * @param {...string} args - Topic and randomID arguments
     */
    dispatchEvent(event: Event, ...args: string[]) {
        const topic = args[0] as string
        const randomID = args[1] as string
        const sliderInput = event.target as HTMLInputElement

        const value = parseInt(sliderInput.value, 10)
        const validatedValue = SliderStrategy.validateSliderValue(value)

        // Update input if value was corrected
        if (validatedValue !== value) {
            sliderInput.value = validatedValue.toString()
        }

        // Update the display span next to the slider
        const displaySpan = sliderInput.nextElementSibling as HTMLSpanElement
        if (displaySpan) {
            displaySpan.textContent = `${validatedValue}%`
        }

        const sliderEvent = createCustomEvent(topic, randomID, validatedValue)
        const consumers = this.registryService.getConsumer(topic)
        consumers?.forEach(item => {
            item.dispatchEvent(sliderEvent)
        })
    }

    /**
     * @method createProviderElement
     * Creates a range slider input for controlling devices.
     *
     * @param {string} topic - The topic name to create a provider for
     * @param {string} [label] - Optional label (defaults to topic name)
     * @returns {HTMLElement} A form element with range slider and value display
     */
    createProviderElement(topic: string, label?: string): HTMLElement {
        const formId = getRandomID()
        const formElement = createBaseForm(formId, 'slider-strategy')

        const labelID = getRandomID()
        const labelElement = createLabelElement(labelID, label ? label : topic, 'provider-item-label_' + topic)
        formElement.appendChild(labelElement)

        // Range slider input
        const sliderElement = document.createElement('input')
        sliderElement.id = labelID
        sliderElement.setAttribute('data-attribute', 'provider-item-input_' + topic)
        sliderElement.setAttribute('type', 'range')
        sliderElement.setAttribute('name', label ? label : topic)
        sliderElement.setAttribute('min', '0')
        sliderElement.setAttribute('max', '100')
        sliderElement.setAttribute('value', '0')
        sliderElement.setAttribute('step', '1')
        sliderElement.style.width = '150px'
        sliderElement.style.marginRight = '8px'

        // Value display span
        const valueSpan = document.createElement('span')
        valueSpan.textContent = '50%'
        valueSpan.style.fontSize = '0.9em'
        valueSpan.style.color = '#666'
        valueSpan.style.fontFamily = 'monospace'
        valueSpan.style.minWidth = '40px'
        valueSpan.style.display = 'inline-block'

        // Event listeners
        sliderElement.addEventListener('input', (event) => this.dispatchEvent(event, topic, labelID))
        sliderElement.addEventListener('change', (event) => this.dispatchEvent(event, topic, labelID))

        formElement.appendChild(sliderElement)
        formElement.appendChild(valueSpan)

        formElement.appendChild(createDeletionButton(formId, () => {
            this.registryService.removeTopic(topic)
        }))

        return formElement
    }

    /**
     * @method createConsumerElement
     * Creates a progress bar display element showing the current slider value.
     *
     * @param {string} topic - The topic to add the consumer to
     * @param {EventData} eventData - The event data containing the slider value
     * @returns {HTMLSpanElement} A span element displaying the progress bar
     */
    createConsumerElement(topic: string, eventData: EventData): HTMLSpanElement {
        const consumerDisplay = document.createElement('span')
        const value = Number(eventData.value) || 0

        consumerDisplay.style.display = 'inline-block'
        consumerDisplay.style.marginLeft = '8px'
        consumerDisplay.style.position = 'relative'
        consumerDisplay.style.width = '120px'
        consumerDisplay.style.height = '20px'
        consumerDisplay.style.backgroundColor = '#f0f0f0'
        consumerDisplay.style.border = '1px solid #ccc'
        consumerDisplay.style.borderRadius = '10px'
        consumerDisplay.style.overflow = 'hidden'

        // Progress fill
        const progressFill = document.createElement('div')
        progressFill.style.position = 'absolute'
        progressFill.style.top = '0'
        progressFill.style.left = '0'
        progressFill.style.height = '100%'
        progressFill.style.width = `${value}%`
        progressFill.style.backgroundColor = '#4a90e2'
        progressFill.style.transition = 'width 0.2s ease'

        // Progress text
        const progressText = document.createElement('div')
        progressText.style.position = 'absolute'
        progressText.style.top = '50%'
        progressText.style.left = '50%'
        progressText.style.transform = 'translate(-50%, -50%)'
        progressText.style.fontSize = '0.8em'
        progressText.style.fontWeight = '500'
        progressText.style.color = value > 50 ? '#fff' : '#333'
        progressText.style.zIndex = '1'
        progressText.textContent = `${value}%`

        consumerDisplay.appendChild(progressFill)
        consumerDisplay.appendChild(progressText)

        consumerDisplay.addEventListener(topic, this.update)
        this.registryService.addConsumer(topic, consumerDisplay)
        return consumerDisplay
    }

    /**
     * @method update
     * Updates the progress bar display when a slider change event is received.
     *
     * @param {Event} event - A custom event containing the new slider value
     */
    update(event: Event): void {
        const eventData: EventData = (<CustomEvent>event).detail as EventData
        const displayElement = this as unknown as HTMLSpanElement
        const value = Number(eventData.value) || 0

        if (displayElement) {
            const progressFill = displayElement.querySelector('div:first-child') as HTMLDivElement
            const progressText = displayElement.querySelector('div:last-child') as HTMLDivElement

            if (progressFill) {
                progressFill.style.width = `${value}%`
            }

            if (progressText) {
                progressText.textContent = `${value}%`
                progressText.style.color = value > 50 ? '#fff' : '#333'
            }
        }
    }
}
