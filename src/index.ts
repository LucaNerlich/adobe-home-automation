import {addGlobalConsumerDisplay, TOPIC_CONSUMER_MAP} from './constants'
import {createCustomEvent, getConsumerContainer, getProviderContainer} from './domUtils'
import {SimpleConsumer} from './devices/consumer/SimpleConsumer'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'

export function sum(a: number, b: number) {
    return a + b
}

const customEvent: CustomEvent = createCustomEvent('lightswitch', 'some-light-switch-id', 0.5)

function provideEvent(this: HTMLElement, event: Event) {
    event.preventDefault()
    this.textContent = 'clicked'
    this.style.backgroundColor = 'red'

    const consumers = TOPIC_CONSUMER_MAP.get(customEvent.type)
    consumers?.forEach(item => {
        item.dispatchEvent(customEvent)
    })
}

const lightswitch = document.getElementById('lightswitch')
lightswitch?.addEventListener('click', provideEvent)

// dummy provider container
const providerContainer = getProviderContainer()
const kitchenLightProvider = new BooleanStrategy().createProviderElement('kitchen-light', 'Kitchen Light')
providerContainer?.appendChild(kitchenLightProvider)


// dummy consumer container
const consumerContainer = getConsumerContainer()

const simpleConsumer = new SimpleConsumer('kitchen-light', 'kitchen-light', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer.getElement())

const simpleConsumer2 = new SimpleConsumer('kitchen-light', 'kitchen-light-secondary', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer2.getElement())

const simpleConsumer3 = new SimpleConsumer('living-room-heater', 'living-room-heater', new NumberStrategy())
const numberDisplay1 = simpleConsumer3.getElement()
numberDisplay1?.addEventListener('lightswitch', simpleConsumer3.strategy.update)
consumerContainer?.appendChild(numberDisplay1)

addGlobalConsumerDisplay('lightswitch', numberDisplay1)
