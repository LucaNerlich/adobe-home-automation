import {getConsumerContainer, getProviderContainer} from './domUtils'
import {ConsumerImpl} from './devices/consumer/ConsumerImpl'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'
import {createSelectOption, generateConsumerForm, generateProviderForm} from './devices/FormService'
import {CONSUMER_FORM_ID, PROVIDER_FORM_ID} from './constants'
import {TextStrategy} from './devices/strategies/TextStrategy'
import {AVAILABLE_TOPICS, useRegistryService} from './devices/RegistryService'

// On click, generates a set of demo providers and consumers
document.getElementById('load-demo-button')?.addEventListener('click', (event) => {
    const TOPIC_LIGHT_1 = 'light-1'
    const TOPIC_LIGHT_2 = 'light-2'
    const TOPIC_HEATING_1 = 'heating-1'
    const TOPIC_TEXT_1 = 'text-1'
    const registryService = useRegistryService()
    AVAILABLE_TOPICS.push(TOPIC_LIGHT_1)
    AVAILABLE_TOPICS.push(TOPIC_LIGHT_2)
    AVAILABLE_TOPICS.push(TOPIC_HEATING_1)
    AVAILABLE_TOPICS.push(TOPIC_TEXT_1)

    const topicSelect = document.querySelector('#consumer-form > select[data-form-element="consumer-topic-select"]')
    topicSelect?.appendChild(createSelectOption(TOPIC_LIGHT_1))
    topicSelect?.appendChild(createSelectOption(TOPIC_LIGHT_2))
    topicSelect?.appendChild(createSelectOption(TOPIC_HEATING_1))
    topicSelect?.appendChild(createSelectOption(TOPIC_TEXT_1))

    const providerContainer = getProviderContainer()

    const kitchenLightProvider = new BooleanStrategy().createProviderElement(TOPIC_LIGHT_1)
    providerContainer?.appendChild(kitchenLightProvider)
    registryService.addTopic(TOPIC_LIGHT_1)
    const livingRoomLightProvider = new BooleanStrategy().createProviderElement(TOPIC_LIGHT_2)
    providerContainer?.appendChild(livingRoomLightProvider)
    registryService.addTopic(TOPIC_LIGHT_2)
    const livingRoomHeatingProvider = new NumberStrategy().createProviderElement(TOPIC_HEATING_1)
    providerContainer?.appendChild(livingRoomHeatingProvider)
    registryService.addTopic(TOPIC_HEATING_1)
    const ledDisplayProvider = new TextStrategy().createProviderElement(TOPIC_TEXT_1)
    providerContainer?.appendChild(ledDisplayProvider)
    registryService.addTopic(TOPIC_TEXT_1)

    const consumerContainer = getConsumerContainer()

    const demoConsumerKitchen1 = new ConsumerImpl(TOPIC_LIGHT_1, 'Kitchen - Light (Left)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerKitchen1.getElement())
    const demoConsumerKitchen2 = new ConsumerImpl(TOPIC_LIGHT_1, 'Kitchen - Light (Right)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerKitchen2.getElement())
    const demoConsumerLivingRoom1 = new ConsumerImpl(TOPIC_LIGHT_2, 'Living Room - Light (All)', new BooleanStrategy())
    consumerContainer?.appendChild(demoConsumerLivingRoom1.getElement())
    const demoConsumerLivingRoom2 = new ConsumerImpl(TOPIC_HEATING_1, 'Living Room - (Heating)', new NumberStrategy())
    consumerContainer?.appendChild(demoConsumerLivingRoom2.getElement())
    const demoConsumerWall1 = new ConsumerImpl(TOPIC_TEXT_1, 'LED Display - (Wall)', new TextStrategy())
    consumerContainer?.appendChild(demoConsumerWall1.getElement())

    // hide demo button
    const demoButton = event.target as HTMLButtonElement
    demoButton.disabled = true
    demoButton.style.display = 'none'
})

// Load Demo Content
document.getElementById('load-demo-button')?.click()

// Initial From Generation
generateProviderForm(document.getElementById(PROVIDER_FORM_ID) as HTMLFormElement)
generateConsumerForm(document.getElementById(CONSUMER_FORM_ID) as HTMLFormElement)
