import {getConsumerContainer, getProviderContainer} from './domUtils'
import {ConsumerImpl} from './devices/consumer/ConsumerImpl'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'
import {generateConsumerForm, generateProviderForm} from './devices/FormService'
import {AVAILABLE_TOPICS, CONSUMER_FORM_ID, PROVIDER_FORM_ID} from './constants'

// todo remove, this is just a jest hello world example
export function sum(a: number, b: number) {
    return a + b
}

document.getElementById('load-demo-button')?.addEventListener('click', (event) => {
    const TOPIC_LIGHT_1 = 'light-1'
    const TOPIC_LIGHT_2 = 'light-2'
    const TOPIC_HEATING_1 = 'heating-1'
    AVAILABLE_TOPICS.push(TOPIC_LIGHT_1)
    AVAILABLE_TOPICS.push(TOPIC_LIGHT_2)
    AVAILABLE_TOPICS.push(TOPIC_HEATING_1)

    // recreate the consumer form with the new topic
    generateConsumerForm(document.getElementById(CONSUMER_FORM_ID) as HTMLFormElement)

    // dummy provider container
    const providerContainer = getProviderContainer()
    const kitchenLightProvider = new BooleanStrategy().createProviderElement(TOPIC_LIGHT_1)
    providerContainer?.appendChild(kitchenLightProvider)
    const livingRoomLightProvider = new BooleanStrategy().createProviderElement(TOPIC_LIGHT_2)
    providerContainer?.appendChild(livingRoomLightProvider)

    const livingRoomHeatingProvider = new NumberStrategy().createProviderElement(TOPIC_HEATING_1)
    providerContainer?.appendChild(livingRoomHeatingProvider)

    // dummy consumer container
    const consumerContainer = getConsumerContainer()

    const demoConsumerKitchen1 = new ConsumerImpl(TOPIC_LIGHT_1, 'Kitchen - Light (Left)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerKitchen1.getElement())

    const demoConsumerKitchen2 = new ConsumerImpl(TOPIC_LIGHT_1, 'Kitchen - Light (Right)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerKitchen2.getElement())

    const demoConsumerLivingRoom1 = new ConsumerImpl(TOPIC_LIGHT_2, 'Living Room - Light (All)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerLivingRoom1.getElement())

    const demoConsumerLivingRoom2 = new ConsumerImpl(TOPIC_HEATING_1, 'Living Room - (Heating)', new NumberStrategy())
    consumerContainer?.appendChild(demoConsumerLivingRoom2.getElement())

    // hide demo button
    const demoButton = event.target as HTMLButtonElement
    demoButton.disabled = true
    demoButton.style.display = 'none'
})

// Initial From Generation
generateProviderForm(document.getElementById(PROVIDER_FORM_ID) as HTMLFormElement)
generateConsumerForm(document.getElementById(CONSUMER_FORM_ID) as HTMLFormElement)

// Load Demo Content
document.getElementById('load-demo-button')?.click()


