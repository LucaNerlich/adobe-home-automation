import {BooleanStrategy} from './strategies/BooleanStrategy'
import {NumberStrategy} from './strategies/NumberStrategy'
import {getConsumerContainer, getProviderContainer, replaceSpaceWithDash} from '../domUtils'
import {CONSUMER_FORM_NAME, STRATEGIES_FORM_NAME, TOPIC_FORM_NAME} from './FormService'
import {ConsumerImpl} from './consumer/ConsumerImpl'
import {Consumer} from './consumer/Consumer'
import {TextStrategy} from './strategies/TextStrategy'
import {StrategyType} from './strategies/StrategyType'
import {DeviceType} from './DeviceType'

/**
 * The function 'createProvider' generates a new HTMLElement depending on the provided 'strategyType'.
 * It first creates a default div element and then, depending on the 'strategyType', processes it through a
 * specific strategy (BooleanStrategy, NumberStrategy, TextStrategy) to create a tailored provider element.
 * If the 'strategyType' is null or not one of the defined strategies, it logs an error and returns the default div.
 *
 * @param {string} topic - The topic for which the provider element has to be created.
 * @param {StrategyType} strategyType - The type of strategy to apply when creating the provider element.
 * @returns {HTMLElement} - The generated HTMLElement based on the provided 'strategyType'.
 */
export function createProvider(topic: string, strategyType: StrategyType): HTMLElement {
    let result: HTMLElement = document.createElement('div')

    if (strategyType != null) {
        switch (strategyType) {
        case StrategyType.BOOLEAN_STRATEGY:
            result = new BooleanStrategy().createProviderElement(topic)
            break
        case StrategyType.NUMBER_STRATEGY:
            result = new NumberStrategy().createProviderElement(topic)
            break
        case StrategyType.TEXT_STRATEGY:
            result = new TextStrategy().createProviderElement(topic)
            break
        default:
            console.error('Cannot create provider for non existent strategy: ', strategyType)
            break
        }
    }

    return result
}

/**
 * The function 'createConsumer' generates a new Consumer object based on the provided 'strategyType'.
 * It initializes the result as null, and then, depending on the 'strategyType', assigns a new ConsumerImpl object
 * with the help of a specific strategy (BooleanStrategy, NumberStrategy, TextStrategy) to the result.
 * If the 'StrategyType' is null or not one of the defined 'StrategyType', it logs an error and does not change the result.
 *
 * @param {string} topic - The topic for which the Consumer object has to be created.
 * @param {string} label - The label for which the Consumer object has to be created.
 * @param {StrategyType} strategyType - The type of strategy to apply when creating the Consumer object.
 * @returns {Consumer | null} - The generated Consumer object based on the provided 'strategyType'. Returns null if invalid 'strategyType'.
 */
export function createConsumer(topic: string, label: string, strategyType: StrategyType): Consumer | null {
    let result: Consumer | null = null

    if (strategyType != null) {
        switch (strategyType) {
        case StrategyType.BOOLEAN_STRATEGY:
            result = new ConsumerImpl(topic, label, new BooleanStrategy())
            break
        case StrategyType.NUMBER_STRATEGY:
            result = new ConsumerImpl(topic, label, new NumberStrategy())
            break
        case StrategyType.TEXT_STRATEGY:
            result = new ConsumerImpl(topic, label, new TextStrategy())
            break
        default:
            console.error('Cannot create consumer for non existent strategy: ', strategyType)
            break
        }
    }

    return result
}

/**
 * This function named 'createDeviceWithFormData' is responsible for creating and adding a device (either a Provider or a Consumer)
 * using form data passed in the argument. It takes formData and a deviceType as arguments.
 *
 * In the function, three initiators are declared for topic, name, and strategyType.
 * An iteration is performed over the form data to extract values for these variables based on predefined form names.
 * If a successful match is found for the variable, the value from the form data is assigned.
 * This function contains a forced typecast for strategyType as it's selected from predefined StrategyTypes.
 *
 * Following the extraction process, a new Consumer or Provider is created and added to the respective container.
 * This depends on the assigned variables and the deviceType passed to the function.
 * If the deviceType is neither a Provider nor a Consumer, an error is logged.
 * @param {FormData} formData - The form data used to create the device.
 * @param {DeviceType} deviceType - The type of device to be created.
 */
export function createDeviceWithFormData(formData: FormData, deviceType: DeviceType) {
    let topic = ''
    let name = ''
    let strategyType: StrategyType | null = null

    // I am aware, that this is technically the second time that we are looping over the same FormData,
    // but it should be feasible with this certainly limited amount of ever available from input values.
    formData.forEach((value, key) => {
        if (key === TOPIC_FORM_NAME) {
            topic = replaceSpaceWithDash(value.toString())
        } else if (key === STRATEGIES_FORM_NAME) {
            // force TypeCast, we know that the select options are being generated by the available StrategyTypes
            strategyType = value as unknown as StrategyType
        } else if (key === CONSUMER_FORM_NAME) {
            name = value as string
        }
    })

    // generate new provider and add to container
    if ((topic && topic.length > 0) && strategyType) {
        const consumerElement = createConsumer(topic, name, strategyType)?.getElement()

        switch (deviceType) {
        case DeviceType.PROVIDER:
            getProviderContainer()?.appendChild(createProvider(topic, strategyType))
            break
        case DeviceType.CONSUMER:
            if (consumerElement) {
                getConsumerContainer()?.appendChild(consumerElement)
            }
            break
        default:
            console.error('No device implementation exists for given type: ', deviceType)
            break
        }
    }
}
