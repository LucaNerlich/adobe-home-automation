import {getConsumerContainer, getProviderContainer} from './domUtils'
import {SimpleConsumer} from './devices/consumer/SimpleConsumer'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'
import {generateConsumerForm, generateProviderForm} from './devices/FormService'

// todo remove, this is just a jest hello world example
export function sum(a: number, b: number) {
    return a + b
}

// TODO
document.getElementById('load-demo-button')?.addEventListener('click', () => {
    console.log('loading demo state')
})

// From Generation
generateProviderForm(document.getElementById('provider-form') as HTMLFormElement)
generateConsumerForm(document.getElementById('consumer-form') as HTMLFormElement)

// dummy provider container
const providerContainer = getProviderContainer()
const kitchenLightProvider = new BooleanStrategy().createProviderElement('kitchen-light')
providerContainer?.appendChild(kitchenLightProvider)
const livingroomLightProvider = new BooleanStrategy().createProviderElement('livingroom-light')
providerContainer?.appendChild(livingroomLightProvider)

const livingRoomHeatingProvider = new NumberStrategy().createProviderElement('living-room-heater')
providerContainer?.appendChild(livingRoomHeatingProvider)


// dummy consumer container
const consumerContainer = getConsumerContainer()

const simpleConsumer = new SimpleConsumer('kitchen-light', 'kitchen-light', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer.getElement())

const simpleConsumer2 = new SimpleConsumer('kitchen-light', 'kitchen-light-secondary', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer2.getElement())

const simpleConsumer3 = new SimpleConsumer('livingroom-light', 'livingroom-light', new BooleanStrategy())
consumerContainer?.appendChild(simpleConsumer3.getElement())

const simpleConsumer4 = new SimpleConsumer('living-room-heater', 'living-room-heater', new NumberStrategy())
consumerContainer?.appendChild(simpleConsumer4.getElement())
