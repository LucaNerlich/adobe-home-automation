/**
 * @jest-environment jsdom
 */

import {createConsumer, createProvider} from '../devices/DeviceService'
import {Consumer} from '../devices/consumer/Consumer'
import {StrategyType} from '../devices/strategies/StrategyType'

const topic = 'some-topic'
const label = 'some-label'

function createTestProvider(strategyType: StrategyType): HTMLElement {
    return createProvider(topic, strategyType)
}

function createTestConsumer(strategyType: StrategyType): Consumer | null {
    return createConsumer(topic, label, strategyType)
}

// Implicitly tests ConsumerImpl, BooleanStrategy and NumberStrategy

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
    expect(input?.getAttribute('name')).toBe(topic)
})

test('Validate NUMBER_STRATEGY provider', () => {
    const provider = createTestProvider(StrategyType.NUMBER_STRATEGY)

    expect(provider).not.toBe(null)
    expect(provider.classList.contains('number-strategy-form')).toBe(true)

    // check topic label
    const label = provider.querySelector('label')
    expect(label).not.toBe(null)
    expect(label?.getAttribute('for')).not.toBe(null)

    // check topic input
    const input = provider.querySelector('input')
    expect(input).not.toBe(null)
    expect(input?.getAttribute('type')).toBe('number')
    expect(input?.getAttribute('name')).toBe(topic)
    expect(input?.getAttribute('min')).not.toBe(null)
    expect(input?.getAttribute('max')).not.toBe(null)
    expect(input?.getAttribute('step')).not.toBe(null)
    expect(input?.getAttribute('placeholder')).not.toBe(null)
})

function testConsumer(consumer: Consumer | null, strategyType: StrategyType) {
    expect(consumer).not.toBe(null)
    expect(consumer?.id).not.toBe(null)
    expect(consumer?.topic).toBe(topic)
    expect(consumer?.label).toBe(label)
    expect(consumer?.strategy).not.toBe(null)
    expect(consumer?.strategy.strategyType).toBe(strategyType)

    const wrapperDiv = consumer?.getElement()
    expect(wrapperDiv).not.toBe(null)
    expect(wrapperDiv?.id).not.toBe(true)
    expect(wrapperDiv?.classList.contains('consumer-item')).toBe(true)

    const topicHintElement = wrapperDiv?.querySelector('p')
    expect(topicHintElement).not.toBe(null)
    expect(topicHintElement?.textContent).toBe(topic)

    // check default display element values
    const display = wrapperDiv?.querySelector('span')
    switch (strategyType) {
    case StrategyType.BOOLEAN_STRATEGY:
        expect(display).not.toBe(null)
        expect(display?.textContent).toBe('OFF')
        break
    case StrategyType.NUMBER_STRATEGY:
        expect(display).not.toBe(null)
        expect(display?.textContent).toBe('N/A')
        break
    }
}

test('Validate BOOLEAN_STRATEGY consumer', () => {
    const consumer = createTestConsumer(StrategyType.BOOLEAN_STRATEGY)
    testConsumer(consumer ? consumer : null, StrategyType.BOOLEAN_STRATEGY)
})

test('Validate NUMBER_STRATEGY consumer', () => {
    const consumer = createTestConsumer(StrategyType.NUMBER_STRATEGY)
    testConsumer(consumer ? consumer : null, StrategyType.NUMBER_STRATEGY)
})

