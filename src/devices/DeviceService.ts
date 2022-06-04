import {StrategyType} from './strategies/Strategy'
import {BooleanStrategy} from './strategies/BooleanStrategy'
import {NumberStrategy} from './strategies/NumberStrategy'

/**
 * Creates a provider element for the given topic and strategy type.
 * @param topic -> the topic for which the provider should emit its event
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
            default:
                console.error('Cannot create provider for non existent strategy: ', strategyType)
                break
        }
    }

    return result
}
