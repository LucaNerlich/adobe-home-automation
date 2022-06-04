import {getConsumerContainer, getProviderContainer} from './domUtils'
import {SimpleConsumer} from './devices/consumer/SimpleConsumer'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'

// todo remove, this is just a jest hello world example
export function sum(a: number, b: number) {
    return a + b
}

// dummy provider container
const providerContainer = getProviderContainer()
const kitchenLightProvider = new BooleanStrategy().createProviderElement('kitchen-light', 'Kitchen Light')
providerContainer?.appendChild(kitchenLightProvider)

const livingRoomHeatingProvider = new NumberStrategy().createProviderElement('living-room-heater', 'living-room-heater')
providerContainer?.appendChild(livingRoomHeatingProvider)


// dummy consumer container
const consumerContainer = getConsumerContainer()

const simpleConsumer = new SimpleConsumer('kitchen-light', 'kitchen-light', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer.getElement())

const simpleConsumer2 = new SimpleConsumer('kitchen-light', 'kitchen-light-secondary', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer2.getElement())

const simpleConsumer3 = new SimpleConsumer('living-room-heater', 'living-room-heater', new NumberStrategy())
consumerContainer?.appendChild(simpleConsumer3.getElement())
