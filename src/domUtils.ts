import {CONSUMER_CONTAINER_ID, FORMS_CONTAINER_ID, PROVIDER_CONTAINER_ID} from "./constants";

export function getConsumerContainer(): HTMLElement | null {
    return document.getElementById(CONSUMER_CONTAINER_ID);
}

export function getProviderContainer(): HTMLElement | null {
    return document.getElementById(PROVIDER_CONTAINER_ID);
}

export function getFormsContainer(): HTMLElement | null {
    return document.getElementById(FORMS_CONTAINER_ID);
}

/**
 * Returns a simple div to be used as a generic wrapper around every consumer item.
 * @param title -> optional value, specify to add a data-title attribute
 */
export function getConsumerWrapper(title?: string): HTMLElement {
    const consumerRootContainer = document.createElement("div");
    consumerRootContainer.classList.add("consumer-item")

    if (title && title.length > 0) {
        consumerRootContainer.setAttribute("data-title", title.replace(" ", "-"))
    }

    return consumerRootContainer;
}
