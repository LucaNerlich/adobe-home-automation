import {getConsumerTopicSelect} from '../domUtils'

const TOPIC_CONSUMER_MAP = new Map<string, Array<HTMLElement>>()
const TOPIC_COUNT_MAP = new Map<string, number>()

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

    function removeConsumer(topic: string) {
        if (TOPIC_CONSUMER_MAP.has(topic)) {
            TOPIC_CONSUMER_MAP.delete(topic)
        }
    }

    function getConsumer(topic: string) {
        return TOPIC_CONSUMER_MAP.get(topic)
    }

    function addTopic(topic: string, callback?: () => void) {
        if (TOPIC_COUNT_MAP.has(topic)) {
            const oldValue = TOPIC_COUNT_MAP.get(topic)
            TOPIC_COUNT_MAP.set(topic, oldValue ? oldValue + 1 : 1)
        } else {
            TOPIC_COUNT_MAP.set(topic, 1)

            if (callback) {
                callback()
            }
        }
    }

    function removeTopic(topic: string): boolean {
        const result = false
        if (TOPIC_COUNT_MAP.has(topic)) {
            const oldValue = TOPIC_COUNT_MAP.get(topic) ?? 0
            const newValue = oldValue > 1 ? oldValue - 1 : 0
            TOPIC_COUNT_MAP.set(topic, newValue)

            if (newValue === 0) {
                console.warn('Deleted last provider of topic: "%s".', topic)

                const topicSelect = getConsumerTopicSelect() as HTMLSelectElement
                Array.from(topicSelect?.options).forEach((option) => {
                    if (option.value === topic) {
                        option.remove()
                    }
                })
            }
        }
        return result
    }

    function getTopicCount(topic: string): number {
        return TOPIC_COUNT_MAP.get(topic) ?? 0
    }

    function getAllTopics() {
        return TOPIC_COUNT_MAP
    }

    return {
        addConsumer,
        removeConsumer,
        getConsumer,
        addTopic,
        removeTopic,
        getTopicCount,
        getAllTopics,
    }
}
