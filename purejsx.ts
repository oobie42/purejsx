/*
 * @jsx purejsx
 */
/// <reference lib="DOM" />

declare namespace JSX {
    // The return type of our JSX Factory
    type Element = HTMLElement;

    // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
    interface IntrinsicElements extends IntrinsicElementMap { }


    // The following are custom types, not part of TS's known JSX namespace:
    type IntrinsicElementMap = {
        [K in keyof HTMLElementTagNameMap]: {
            [k: string]: any
        }
    }

    type Tag = keyof JSX.IntrinsicElements;

    interface Component {
        (properties?: { [key: string]: any }, children?: Node[]): Node
    }
}

// This function name is the jsxFactory arg.
export function purejsx<T extends JSX.Tag = JSX.Tag>(
    tag: T,
    attributes: { [key: string]: any } | null,
    ...children: Node[]): JSX.Element
export function purejsx(
    tag: JSX.Component,
    attributes: Parameters<typeof tag> | null,
    ...children: Node[]): Node
export function purejsx(
    tag: JSX.Tag | JSX.Component,
    attributes: { [key: string]: any } | null,
    ...children: Node[]) {
    if (typeof tag === 'function') {
        return tag(attributes ?? {}, children);
    }
    type Tag = typeof tag;
    const element: HTMLElementTagNameMap[Tag] = document.createElement(tag);

    // Assign attributes:
    let map = (attributes ?? {});
    let prop: keyof typeof map;
    for (prop of (Object.keys(map) as any)) {

        // Extract values:
        prop = prop.toString();
        const value = map[prop] as any;
        const anyReference = element as any;
        if (typeof anyReference[prop] === 'undefined') {
            // As a fallback, attempt to set an attribute:
            element.setAttribute(prop, value);
        } else {
            anyReference[prop] = value;
        }
    }

    // append children
    for (let child of children) {
        if (typeof child === 'string') {
            element.innerText += child;
            continue;
        }
        if (Array.isArray(child)) {
            element.append(...child);
            continue;
        }
        element.appendChild(child);
    }
    return element;
}
