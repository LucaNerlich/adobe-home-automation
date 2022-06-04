/**
 * @jest-environment jsdom
 */

import {StrategyType} from '../devices/strategies/Strategy'
import {createProvider} from '../devices/DeviceService'

function createTestProvider(strategyType: StrategyType): HTMLElement {
    return createProvider('some-topic', strategyType)
}

test('createProvider returns element for BOOLEAN_STRATEGY', () => {
    const provider = createTestProvider(StrategyType.BOOLEAN_STRATEGY)

    expect(provider).not.toBe(null)
})

test('Validate BOOLEAN_STRATEGY provider', () => {
    const provider = createTestProvider(StrategyType.BOOLEAN_STRATEGY)

    expect(provider).not.toBe(null)
    expect(provider.classList.contains('bool-strategy-form')).toBe(true)

    // check topic label
    const label = provider.querySelector('label')
    expect(label).not.toBe(null)
    expect(label?.getAttribute('for')).not.toBe(null)

    // check topic input
    const input = provider.querySelector('input')
    expect(input).not.toBe(null)
    expect(input?.getAttribute('type')).toBe('checkbox')
    expect(input?.getAttribute('name')).toBe('some-topic')
})

test('createProvider returns element for NUMBER_STRATEGY', () => {
    const provider = createTestProvider(StrategyType.NUMBER_STRATEGY)

    expect(provider).not.toBe(null)
})

test('Validate NUMBER_STRATEGY provider', () => {
    const provider = createTestProvider(StrategyType.NUMBER_STRATEGY)

    expect(provider).not.toBe(null)
    expect(provider.classList.contains('number-strategy-form')).toBe(true)
})

