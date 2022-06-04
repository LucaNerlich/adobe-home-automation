import {EventData} from './entities/EventData'
import {addGlobalConsumer, TOPIC_CONSUMER_MAP} from './constants'
import {getConsumerContainer} from './domUtils'
import {SimpleConsumer} from './devices/consumer/SimpleConsumer'
import {BooleanStrategy} from './devices/strategies/BooleanStrategy'
import {NumberStrategy} from './devices/strategies/NumberStrategy'

export function sum(a: number, b: number) {
    return a + b
}

const customEvent: CustomEvent = new CustomEvent('lightswitch', {
    detail: {
        id: 'some-light-switch-id',
        value: 0.5,
    } as EventData,
})


function provideEvent(this: HTMLElement, event: Event) {
    console.log('dispatching custom event')

    event.preventDefault()
    this.textContent = 'clicked'
    this.style.backgroundColor = 'red'
    console.log('event.type', event.type)

    const eventData: EventData = (<CustomEvent>event).detail as EventData
    console.log('eventData', eventData)

    const consumers = TOPIC_CONSUMER_MAP.get(customEvent.type)
    consumers?.forEach(item => {
        item.dispatchEvent(customEvent)
    })
}

const lightswitch = document.getElementById('lightswitch')
lightswitch?.addEventListener('click', provideEvent)


// dummy consumer
let consumerContainer = getConsumerContainer()
let simpleConsumer = new SimpleConsumer('kitchen-light', new BooleanStrategy())
let boolDisplay1 = simpleConsumer.getElement()
boolDisplay1?.addEventListener('lightswitch', simpleConsumer.strategy.update)
consumerContainer?.appendChild(boolDisplay1)

let simpleConsumer2 = new SimpleConsumer('kitchen-light-secondary', new BooleanStrategy())
let boolDisplay2 = simpleConsumer2.getElement()
boolDisplay2?.addEventListener('lightswitch', simpleConsumer2.strategy.update)
consumerContainer?.appendChild(boolDisplay2)

let simpleConsumer3 = new SimpleConsumer('living-room-heater', new NumberStrategy())
let numberDisplay1 = simpleConsumer3.getElement()
numberDisplay1?.addEventListener('lightswitch', simpleConsumer3.strategy.update)
consumerContainer?.appendChild(numberDisplay1)

addGlobalConsumer('lightswitch', boolDisplay1)
addGlobalConsumer('lightswitch', boolDisplay2)
addGlobalConsumer('lightswitch', numberDisplay1)
