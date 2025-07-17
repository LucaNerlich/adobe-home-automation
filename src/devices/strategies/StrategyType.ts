/**
 * `StrategyType` is an enumeration type in TypeScript that defines the possible types of strategies.
 * Each strategy type has a matching string value.
 * It includes the following possible cases:
 * - BOOLEAN_STRATEGY: For strategies that work with boolean data.
 * - NUMBER_STRATEGY: For strategies that work with numerical data.
 * - TEXT_STRATEGY: For strategies that work with textual data.
 * - COLOR_STRATEGY: For strategies that work with color data (RGB/Hex).
 * - TEMPERATURE_STRATEGY: For strategies that work with temperature data with units.
 * - SELECT_STRATEGY: For strategies that work with predefined option selections.
 * - SLIDER_STRATEGY: For strategies that work with range/slider controls.
 * - TIME_STRATEGY: For strategies that work with time data (HH:MM format).
 */
export enum StrategyType {
    BOOLEAN_STRATEGY = 'BOOLEAN_STRATEGY',
    NUMBER_STRATEGY = 'NUMBER_STRATEGY',
    TEXT_STRATEGY = 'TEXT_STRATEGY',
    COLOR_STRATEGY = 'COLOR_STRATEGY',
    TEMPERATURE_STRATEGY = 'TEMPERATURE_STRATEGY',
    SELECT_STRATEGY = 'SELECT_STRATEGY',
    SLIDER_STRATEGY = 'SLIDER_STRATEGY',
    TIME_STRATEGY = 'TIME_STRATEGY'
}
