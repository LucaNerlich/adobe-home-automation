import {getConsumerTopicSelect} from '../domUtils'

const TOPIC_CONSUMER_MAP = new Map<string, Array<HTMLElement>>()
const TOPIC_COUNT_MAP = new Map<string, number>()

/**
 * Main object 'useRegistryService' is a hook and is essentially a registry service to manage topics and their
 * consumers. Functionalities include:
 * - addConsumer: Adds a consumer to a topic in the TOPIC_CONSUMER_MAP.
 * - removeConsumer: Removes a consumer from a topic in the TOPIC_CONSUMER_MAP.
 * - getConsumer: Fetches the consumer of a particular topic
 * - addTopic: Adds a new topic to the TOPIC_COUNT_MAP. If the topic exists, increment the count, else initialize it.
 *      If specified, a callback is invoked when the topic is created.
 * - removeTopic: Removes a topic. If it's the last provider, a warning is thrown.
 *      If the topic is selected somewhere in the system (say in a dropdown), it's removed from there as well.
 * - getTopicCount: Fetches the count of a particular topic from the TOPIC_COUNT_MAP.
 * - getAllTopics: Fetch the entire TOPIC_COUNT_MAP.
 *
 * All above methods are returned from the 'useRegistryService' as an object.
 */
export const  useRegistryService = () => {
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

    /**
     * @method getTopicCount
     * @description Returns the count of the provided topic from the TOPIC_COUNT_MAP.
     * If the topic does not exist in the map, the method will return 0.
     * @param {string} topic - The name of the topic.
     * @returns {number} The count of the topic.
     */
    
    function getTopicCount(topic: string): number {
        return TOPIC_COUNT_MAP.get(topic) ?? 0
    }

    /**
     * @method getAllTopics
     * @description Returns the entire TOPIC_COUNT_MAP
     * This map includes all `topic` keys along with their corresponding count values.
     * @returns {Map<string, number>} The entire TOPIC_COUNT_MAP 
     */
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
