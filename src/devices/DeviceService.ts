import {BooleanStrategy} from './strategies/BooleanStrategy'
import {NumberStrategy} from './strategies/NumberStrategy'
import {getConsumerContainer, getProviderContainer, replaceSpaceWithDash} from '../domUtils'
import {CONSUMER_FORM_NAME, STRATEGIES_FORM_NAME, TOPIC_FORM_NAME} from './FormService'
import {ConsumerImpl} from './consumer/ConsumerImpl'
import {Consumer} from './consumer/Consumer'
import {TextStrategy} from './strategies/TextStrategy'
import {StrategyType} from './strategies/StrategyType'

/**
 * Creates a provider element for the given topic and strategy type.
 * @param topic -> the event topic for which the provider should emit its event
 * @param strategyType -> the type of strategy which the provider should implement
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
 * Creates a consumer element for the given topic and strategy type.
 * @param topic -> the event topic which the consumer should listen to
 * @param label -> a name or label to identify the consumer / device
 * @param strategyType -> the type of strategy which the consumer should implement
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
 * Loop over the given FormData and, if a topic and strategyType are present,
 * creates a new provider and adds it to the list.
 * @param formData
 * @param deviceType -> either PROVIDER or CONSUMER - {@link DeviceType}
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

export enum DeviceType {
    PROVIDER = 'PROVIDER',
    CONSUMER = 'CONSUMER'
}
