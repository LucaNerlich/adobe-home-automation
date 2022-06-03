import {EventData} from "./entities/EventData";
import {TOPIC_CONSUMER_MAP} from "./constants";
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
    event.preventDefault();
    this.textContent = "off"
    this.style.backgroundColor = "red";
    console.log("event.type", event.type);
    if (event.type === "click") {
        lightswitch?.dispatchEvent(customEvent)
        lightbulb?.dispatchEvent(customEvent)
    }
    if (event.type === "lightswitch") {
        const eventData: EventData = (<CustomEvent>event).detail as EventData;
        console.log("eventData", eventData);
    }
}

function consumeEvent(this: HTMLElement, event: Event) {
    event.preventDefault();
    console.log("lightbulb", lightbulb);
    const eventData: EventData = (<CustomEvent>event).detail as EventData;
    this.textContent = eventData.value
}

const lightswitch = document.getElementById("lightswitch");
lightswitch?.addEventListener("lightswitch", provideEvent)
lightswitch?.addEventListener("click", provideEvent)


const lightbulb = document.getElementById("lightbulb");
lightbulb?.addEventListener("lightswitch", consumeEvent)


TOPIC_CONSUMER_MAP.set("lightswitch", lightbulb);
console.log("topicConsumerMap", TOPIC_CONSUMER_MAP);

let consumerContainer = getConsumerContainer();
let simpleConsumer = new SimpleConsumer("some-consumer-label", new BooleanStrategy());
let displayElement = simpleConsumer.getDisplayElement();
console.log("displayElement", displayElement);
consumerContainer?.appendChild(displayElement)
