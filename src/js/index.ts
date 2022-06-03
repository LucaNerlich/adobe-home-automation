import {EventData} from "./entities/EventData";

function test() {
    console.log("ping2");
}

export function sum(a: number, b: number) {
    return a + b;
}

test();

const customEvent: CustomEvent = new CustomEvent('lightswitch', {
    detail: {
        id: "some-light-switch-id",
        value: 0.5
    } as EventData
});

function handleEvent(this: HTMLElement, event: Event) {
    event.preventDefault();
    this.style.backgroundColor = "red";
    console.log("handleEvent");
    console.log("event", event.type);
    if (event.type === "click") {
        lightswitch?.dispatchEvent(customEvent)
    }
    if (event.type === "lightswitch") {
        const eventData: EventData = (<CustomEvent>event).detail as EventData;
        console.log("eventData", eventData);
    }
}

const lightswitch = document.getElementById("lightswitch");
lightswitch?.addEventListener("lightswitch", handleEvent)
lightswitch?.addEventListener("click", handleEvent)
