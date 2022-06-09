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
