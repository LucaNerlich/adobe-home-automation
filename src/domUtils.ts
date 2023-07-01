import {CONSUMER_CONTAINER_ID, PROVIDER_CONTAINER_ID} from './constants'
import {EventData} from './entities/EventData'
import {DataAttribute} from './entities/DataAttribute'

/**
 * This function returns the consumer container HTMLElement within the DOM, or null if such an element does not exist.
 * The identifier specified for this container is provided by the constant value `CONSUMER_CONTAINER_ID`.
 * The container element compatibility is dynamically checked in the typescript by ensuring the value is of type `HTMLElement` or `null`.
 * It uses the native `getElementById` method of the `document` object to find the element by its ID in the document's DOM tree.
 * @returns {HTMLElement | null} The consumer container HTMLElement when found, null otherwise.
 */
export function getConsumerContainer(): HTMLElement | null {
    return document.getElementById(CONSUMER_CONTAINER_ID)
}

/**
 * This function returns the provider container HTMLElement within the DOM, or null if such an element doesn't exist.
 * The identifier used for this container is provided by the constant value `PROVIDER_CONTAINER_ID`.
 * The function dynamically checks the container element compatibility in TypeScript by ensuring the returned value is either
 * `HTMLElement` or `null`.
 * It leverages the `getElementById` method of the `document` object to locate the element by its ID within the document's DOM tree.
 * @returns {HTMLElement | null} The provider container HTMLElement if found, null otherwise.
 */
export function getProviderContainer(): HTMLElement | null {
    return document.getElementById(PROVIDER_CONTAINER_ID)
}

/**
 * Creates a custom event with specified topic, id, and value.
 *
 * Inside it a `CustomEvent` object is created with the specified `topic` as the event type,
 * and detail object containing the `id` and `value` parameters converted to `EventData` object.
 * `CustomEvent` is a constructor function that creates an event object of type `CustomEvent`.
 *
 * @param {string} topic - The string representing the custom event name.
 * @param {string} id - The string representing the identifier of the event.
 * @param {string | number | boolean | object} value - The value which can be of type string, number, boolean or object representing the value associated with the event.
 * @returns {CustomEvent} - The new CustomEvent object.
 */
export function createCustomEvent(topic: string, id: string, value: string | number |  boolean | object): CustomEvent {
    return new CustomEvent(topic, {
        detail: {
            id: id,
            value: value,
        } as EventData,
    })
}

/**
 * The `replaceSpaceWithDash` function transforms the provided string by replacing all space characters with dashes ('-').
 * After that, it turns the entire string into lower case letters.
 * This function applies the built-in `replaceAll` method of the string, which replaces all matched values in the string.
 * The function takes a string as an argument and returns the modified string.
 *
 * @param {string} value - The input string that needs transformation.
 * @returns {string} The modified string after replacing all spaces with dashes and changing to lower case.
 */
export function replaceSpaceWithDash(value: string) {
    return value?.replaceAll(' ', '-').toLowerCase()
}

/**
 * This function creates an HTMLFormElement with a specified id and label.
 * A new form HTML element is initialized via the `document.createElement` method, and then assigned with the specified id.
 * A css class is also added to the form element, constructed as `<label>-form` (Ex: if label is `invoice`, class will be `invoice-form`).
 * The CSS class associated with the form is formed by concatenating the label parameter and "-form".
 *
 * @param {string} id - The identifier to be assigned to the created form HTML element.
 * @param {string} label - The label for the form, used in the constructing the form's specific CSS class.
 * @returns {HTMLFormElement} - The created HTMLFormElement after assigning the id and adding the specified CSS class.
 */
export function createBaseForm(id: string, label: string): HTMLFormElement {
    const formElement = document.createElement('form')
    formElement.classList.add(`${label}-form`)
    formElement.id = id

    return formElement
}

/**
 * This function creates a data attribute object with the specified suffix and value.
 * A data attribute object is an object that conforms to the `DataAttribute` type, containing `type` and `value` properties.
 * The function constructs the `type` by concatenating 'data-' with the given suffix, and assigns the provided value to the `value` property.
 *
 * @param {string} suffix - The suffix to be appended to 'data-' for creating the data attribute type.
 * @param {string | number | boolean | object} value - The value to be assigned to the data attribute. Can be of type string, number, boolean, or object.
 * @returns {DataAttribute} - The created data attribute object.
 */
export function createDataAttribute(suffix: string, value: string | number |  boolean | object): DataAttribute {
    return {
        type: 'data-' + suffix,
        value: value,
    } as DataAttribute
}

/**
 * This function creates a data attribute object specific for form elements, with the value being specified.
 * It utilises the `createDataAttribute` function to construct a data attribute object with 'form-element' as the type
 * and the given value as the value of the data attribute.
 *
 * @param {string} value - The value to be assigned to the form-element data attribute. This should be a string.
 * @returns {DataAttribute} - The created form-element data attribute object.
 */
export function getFormDataAttribute(value: string) {
    return createDataAttribute('form-element', value)
}

/**
 * The `setDataAttribute` function sets the value of the DataAttribute for a particular HTML element.
 * The `element` parameter represents the HTML element to which the data attribute should be set.
 * The `dataAttribute` parameter is an object of type `DataAttribute` with 'type' and 'value' properties representing the data attribute to be set.
 * This function uses the built-in `setAttribute` method of the HTMLElement to set the attribute's type and value.
 *
 * @param {HTMLElement} element - The HTML element to which the attribute should be set.
 * @param {DataAttribute} dataAttribute - The data attribute to be set to the element.
 */
export function setDataAttribute(element: HTMLElement, dataAttribute: DataAttribute): void {
    element.setAttribute(dataAttribute.type, dataAttribute.value)
}

/**
 * This function returns the consumer topic select HTML element in the DOM, or null if such an element does not exist.
 * It uses the `querySelector` method of the `document` object to find the element by its CSS selector in the document's DOM tree.
 * The CSS selector used is '#consumer-form > select[data-form-element="consumer-topic-select"]'.
 * @returns {HTMLElement | null} The consumer topic select HTML element when found, null otherwise.
 */
export function getConsumerTopicSelect() {
    return document.querySelector('#consumer-form > select[data-form-element="consumer-topic-select"]')
}

/**
 * `createDeletionButton` function generates an HTML button which, when clicked, deletes the HTML element specified by `elementId` from the DOM.
 *
 * In addition, the function supports providing an optional `callback` function, which will be called when the button is clicked.
 * Notably, the button is labelled with 'X' and is associated with a click event listener that initiates the `deleteElement` action, defined within `createDeletionButton`.
 * It also adds 'delete' to the class list of the button and sets the data attribute of the button using the `setDataAttribute` function and `getFormDataAttribute` function.
 *
 * @param {string} elementId - The ID of the HTMLElement to remove from the DOM upon click.
 * @param {() => void} callback - An optional callback function that is triggered when the button is clicked.
 * @returns {HTMLButtonElement} - The created deletion button element.
 */
export function createDeletionButton(elementId: string, callback?: () => void): HTMLButtonElement {
    /**
     * The `deleteElement` function removes an HTML element with `elementId` from the DOM and optionally calls a `callback` function.
     * If the HTML element with `elementId` exists, it will be removed from the DOM.
     * Afterwards, if a `callback` function is provided, it will be called.
     * The `getElementById` method of the `document` object is used to locate the HTML element.
     * If located, the `remove` method is used to remove the HTML element from the DOM.
     */
    function deleteElement() {
        document.getElementById(elementId)?.remove()
        if (callback) {
            callback()
        }
    }

    const button = document.createElement('button')
    button.textContent = 'X'
    button.addEventListener('click', deleteElement)
    button.classList.add('delete')
    setDataAttribute(button, getFormDataAttribute('delete-' + elementId))

    return button
}
