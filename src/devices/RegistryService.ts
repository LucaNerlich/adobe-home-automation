// Topic -> Consumers Map
const TOPIC_CONSUMER_MAP = new Map<string, Array<HTMLElement>>()

export const useRegistryService = () => {
    function addConsumer(topic: string, consumer: HTMLElement | null) {
        if (consumer) {
            if (TOPIC_CONSUMER_MAP.has(topic)) {
                TOPIC_CONSUMER_MAP.get(topic)?.push(consumer)
            } else {
                TOPIC_CONSUMER_MAP.set(topic, [consumer])
            }
        }
    }

    function removeConsumer() {

    }

    function getConsumer(topic: string) {
        return TOPIC_CONSUMER_MAP.get(topic)
    }

    function addProvider() {

    }

    function removeProvider() {

    }

    return {
        addConsumer,
        removeConsumer,
        getConsumer,
        addProvider,
        removeProvider,
    }
}

// On provider creation submit, the new topic will be added here.
// Can be used by consumer form, for example.
export const AVAILABLE_TOPICS: Array<string> = []
