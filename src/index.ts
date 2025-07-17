import {getConsumerContainer, getProviderContainer} from './domUtils'
import {ConsumerImpl} from './devices/consumer/ConsumerImpl'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'
import {ColorStrategy} from './devices/strategies/ColorStrategy'
import {TemperatureStrategy} from './devices/strategies/TemperatureStrategy'
import {SliderStrategy} from './devices/strategies/SliderStrategy'
import {TimeStrategy} from './devices/strategies/TimeStrategy'
import {createSelectOption, generateConsumerForm, generateProviderForm} from './devices/FormService'
import {CONSUMER_FORM_ID, PROVIDER_FORM_ID} from './constants'
import {TextStrategy} from './devices/strategies/TextStrategy'
import {useRegistryService} from './devices/RegistryService'

// On click, generates a set of demo providers and consumers
document.getElementById('load-demo-button')?.addEventListener('click', (event) => {
    const TOPIC_LIGHT_1 = 'light-1'
    const TOPIC_LIGHT_2 = 'light-2'
    const TOPIC_HEATING_1 = 'heating-1'
    const TOPIC_TEXT_1 = 'text-1'
    const TOPIC_BEDROOM_LIGHTS = 'bedroom-lights'
    const TOPIC_THERMOSTAT_MODE = 'thermostat-main'
    const TOPIC_VOLUME_CONTROL = 'volume-control'
    const TOPIC_SCHEDULE_TIMER = 'schedule-timer'
    const registryService = useRegistryService()

    const topicSelect = document.querySelector('#consumer-form > select[data-form-element="consumer-topic-select"]')
    topicSelect?.appendChild(createSelectOption(TOPIC_LIGHT_1))
    topicSelect?.appendChild(createSelectOption(TOPIC_LIGHT_2))
    topicSelect?.appendChild(createSelectOption(TOPIC_HEATING_1))
    topicSelect?.appendChild(createSelectOption(TOPIC_TEXT_1))
    topicSelect?.appendChild(createSelectOption(TOPIC_BEDROOM_LIGHTS))
    topicSelect?.appendChild(createSelectOption(TOPIC_THERMOSTAT_MODE))
    topicSelect?.appendChild(createSelectOption(TOPIC_VOLUME_CONTROL))
    topicSelect?.appendChild(createSelectOption(TOPIC_SCHEDULE_TIMER))

    const providerContainer = getProviderContainer()

    // Existing providers
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

    // New strategy providers
    const bedroomLightsProvider = new ColorStrategy().createProviderElement(TOPIC_BEDROOM_LIGHTS)
    providerContainer?.appendChild(bedroomLightsProvider)
    registryService.addTopic(TOPIC_BEDROOM_LIGHTS)
    const thermostatModeProvider = new TemperatureStrategy().createProviderElement(TOPIC_THERMOSTAT_MODE)
    providerContainer?.appendChild(thermostatModeProvider)
    registryService.addTopic(TOPIC_THERMOSTAT_MODE)
    const volumeControlProvider = new SliderStrategy().createProviderElement(TOPIC_VOLUME_CONTROL)
    providerContainer?.appendChild(volumeControlProvider)
    registryService.addTopic(TOPIC_VOLUME_CONTROL)
    const scheduleTimerProvider = new TimeStrategy().createProviderElement(TOPIC_SCHEDULE_TIMER)
    providerContainer?.appendChild(scheduleTimerProvider)
    registryService.addTopic(TOPIC_SCHEDULE_TIMER)

    const consumerContainer = getConsumerContainer()

    // Existing consumers
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

    // New strategy consumers
    const demoConsumerBedroom1 = new ConsumerImpl(TOPIC_BEDROOM_LIGHTS, 'Bedroom - RGB Lights (Main)', new ColorStrategy())
    consumerContainer?.appendChild(demoConsumerBedroom1.getElement())
    const demoConsumerThermostat = new ConsumerImpl(TOPIC_THERMOSTAT_MODE, 'Living Room - Thermostat', new TemperatureStrategy())
    consumerContainer?.appendChild(demoConsumerThermostat.getElement())
    const demoConsumerVolume = new ConsumerImpl(TOPIC_VOLUME_CONTROL, 'Sound System - Volume', new SliderStrategy())
    consumerContainer?.appendChild(demoConsumerVolume.getElement())
    const demoConsumerSchedule = new ConsumerImpl(TOPIC_SCHEDULE_TIMER, 'Automation - Daily Schedule', new TimeStrategy())
    consumerContainer?.appendChild(demoConsumerSchedule.getElement())

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
