/**
 * Encapsulates data sent from a provider to a consumer.
 */
export interface EventData {
    id: string,
    label?: string,
    value: string | number | object,
}
