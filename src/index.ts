import {EventData} from "./entities/EventData";
import {addGlobalConsumer, TOPIC_CONSUMER_MAP} from "./constants";
import {getConsumerContainer} from "./domUtils";
import {SimpleConsumer} from "./consumer/SimpleConsumer";
import {BooleanStrategy} from "./strategies/BooleanStrategy";
import {NumberStrategy} from "./strategies/NumberStrategy";

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

function dummyEventHandler(this: HTMLElement, event: Event) {
    event.preventDefault();
    const eventData: EventData = (<CustomEvent>event).detail as EventData;
    console.log("eventData", eventData);

    const displaySpan = this.querySelector("span:first-of-type");

    // todo move to consume / strategy and handle properly
    if (displaySpan) {
        displaySpan.textContent = eventData.value
    }
    console.log("displaySpan", displaySpan);
}

const lightswitch = document.getElementById("lightswitch");
lightswitch?.addEventListener("click", provideEvent)


function ping() {
    console.log("ping in consumer");
}

// dummy consumer
let consumerContainer = getConsumerContainer();
let simpleConsumer = new SimpleConsumer("kitchen-light", new BooleanStrategy(), ping);
let boolConsumer1 = simpleConsumer.getElement();
boolConsumer1?.addEventListener("lightswitch", dummyEventHandler)
consumerContainer?.appendChild(boolConsumer1)

let simpleConsumer2 = new SimpleConsumer("kitchen-light-secondary", new BooleanStrategy(), ping);
let boolConsumer2 = simpleConsumer2.getElement();
boolConsumer2?.addEventListener("lightswitch", dummyEventHandler)
consumerContainer?.appendChild(boolConsumer2)

let simpleConsumer3 = new SimpleConsumer("living-room-heater", new NumberStrategy(), ping);
let numberConsumer1 = simpleConsumer3.getElement();
numberConsumer1?.addEventListener("lightswitch", dummyEventHandler)
consumerContainer?.appendChild(numberConsumer1)

addGlobalConsumer("lightswitch", boolConsumer1)
addGlobalConsumer("lightswitch", boolConsumer2)
addGlobalConsumer("lightswitch", numberConsumer1)
