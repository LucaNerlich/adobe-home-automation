// Topic -> Consumers Map
export const TOPIC_CONSUMER_MAP = new Map<string, Array<HTMLElement>>()

export function addGlobalConsumerDisplay(topic: string, consumer: HTMLElement | null): void {
    if (consumer) {
        if (TOPIC_CONSUMER_MAP.has(topic)) {
            TOPIC_CONSUMER_MAP.get(topic)?.push(consumer)
        } else {
            TOPIC_CONSUMER_MAP.set(topic, [consumer])
        }
    }
}

// On provider creation submit, the new topic will be added here.
// Can be used by consumer form, for example.
export const AVAILABLE_TOPICS: Array<string> = []

// DOM
export const PROVIDER_CONTAINER_ID = 'provider'
export const PROVIDER_FORM_ID = 'provider-form'
export const CONSUMER_CONTAINER_ID = 'consumer'
export const CONSUMER_FORM_ID = 'consumer-form'

// Generate "random" uuid
// Taken from <https://learnersbucket.com/examples/javascript/unique-id-generator-in-javascript/>
export function getRandomID(): string {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }

    return s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
}
