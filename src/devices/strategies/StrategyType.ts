/**
 * `StrategyType` is an enumeration type in TypeScript that defines the possible types of strategies.
 * Each strategy type has a matching string value.
 * It includes the following possible cases:
 * - BOOLEAN_STRATEGY: For strategies that work with boolean data.
 * - NUMBER_STRATEGY: For strategies that work with numerical data.
 * - TEXT_STRATEGY: For strategies that work with textual data.
 */
export enum StrategyType {
    BOOLEAN_STRATEGY = 'BOOLEAN_STRATEGY',
    NUMBER_STRATEGY = 'NUMBER_STRATEGY',
    TEXT_STRATEGY = 'TEXT_STRATEGY'
}
