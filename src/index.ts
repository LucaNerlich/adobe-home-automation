import {EventData} from "./entities/EventData";
import {addGlobalConsumer, TOPIC_CONSUMER_MAP} from "./constants";
import {getConsumerContainer} from "./domUtils";
import {SimpleConsumer} from "./consumer/SimpleConsumer";
import {BooleanStrategy} from "./strategies/BooleanStrategy";

export function sum(a: number, b: number) {
    return a + b;
}

const customEvent: CustomEvent = new CustomEvent('lightswitch', {
    detail: {
        id: "some-light-switch-id",
        value: 0.5
    } as EventData
});


function provideEvent(this: HTMLElement, event: Event) {
    console.log("dispatching custom event");

    event.preventDefault();
    this.textContent = "clicked"
    this.style.backgroundColor = "red";
    console.log("event.type", event.type);

    const eventData: EventData = (<CustomEvent>event).detail as EventData;
    console.log("eventData", eventData);

    const consumers = TOPIC_CONSUMER_MAP.get(customEvent.type);
    consumers?.forEach(item => {
        item.dispatchEvent(customEvent)
    })
}

function consumeEvent(this: HTMLElement, event: Event) {
    event.preventDefault();
    const eventData: EventData = (<CustomEvent>event).detail as EventData;
    console.log("eventData", eventData);

    this.textContent = eventData.value
}

const lightswitch = document.getElementById("lightswitch");
lightswitch?.addEventListener("lightswitch", provideEvent)
lightswitch?.addEventListener("click", provideEvent)


function ping() {
    console.log("ping in consumer");
}

// dummy consumer
let consumerContainer = getConsumerContainer();
let simpleConsumer = new SimpleConsumer("kitchen-light", new BooleanStrategy(), ping);
let simpleConsumerElement = simpleConsumer.getElement();
simpleConsumerElement?.addEventListener("lightswitch", consumeEvent)
consumerContainer?.appendChild(simpleConsumerElement)

let simpleConsumer2 = new SimpleConsumer("kitchen-light-secondary", new BooleanStrategy(), ping);
let simpleConsumerElement2 = simpleConsumer2.getElement();
simpleConsumerElement2?.addEventListener("lightswitch", consumeEvent)
consumerContainer?.appendChild(simpleConsumerElement2)

addGlobalConsumer("lightswitch", simpleConsumerElement)
addGlobalConsumer("lightswitch", simpleConsumerElement2)
