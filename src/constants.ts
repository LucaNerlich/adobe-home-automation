// Topic -> Consumers Map
export const TOPIC_CONSUMER_MAP = new Map<string, Array<HTMLElement>>()

export function addGlobalConsumer(topic: string, consumer: HTMLElement | null): void {
    if (consumer) {
        if (TOPIC_CONSUMER_MAP.has(topic)) {
            TOPIC_CONSUMER_MAP.get(topic)?.push(consumer)
        } else {
            TOPIC_CONSUMER_MAP.set(topic, [consumer])
        }
    }
}

// DOM
export const PROVIDER_CONTAINER_ID: string = 'provider'
export const CONSUMER_CONTAINER_ID: string = 'consumer'
export const DASHBOARD_CONTAINER_ID: string = 'dashboard'
export const FORMS_CONTAINER_ID: string = 'forms'


// Generate "random" uuid
// Taken from <https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/>
export function getRandomID(): string {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }

    return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
}
