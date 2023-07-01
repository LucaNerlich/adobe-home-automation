/**
 * The `EventData` interface encapsulates the data that is sent from a provider to a consumer within the system.
 *
 * @property {string} id - A unique identifier for the event data object.
 * @property {string} [label] - An optional label that provides additional, human-readable information about the event.
 * @property {string | number | boolean | object} value - The actual data being transferred. It can be a string, number, boolean, or object.
 */
export interface EventData {
    id: string,
    label?: string,
    value: string | number |  boolean | object,
}
