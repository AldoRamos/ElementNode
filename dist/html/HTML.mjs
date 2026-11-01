import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
import { TextNode } from '../core/TextNode.mjs';
const attributeKeys = new Set(['id', 'class', 'className', 'name', 'value', 'src', 'alt', 'href', 'title', 'type', 'role', 'disabled', 'selected', 'checked', 'data', 'aria']);
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function isAttributeMap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof ContentNode) {
        return false;
    }
    return Object.keys(value).some(key => attributeKeys.has(key) || key.startsWith('data-') || key.startsWith('aria-')) || Object.keys(value).length === 0;
}
function normalize(input, output) {
    if (input === null || input === undefined) {
        return;
    }
    if (Array.isArray(input)) {
        input.forEach(item => normalize(item, output));
        return;
    }
    if (input instanceof ContentNode) {
        output.push(input);
        return;
    }
    if (typeof input === 'string' || typeof input === 'number') {
        output.push(new TextNode(String(input)));
        return;
    }
    throw new TypeError('Unsupported ContentNode child. Rendered DOM and jQuery objects are not valid model children.');
}
class HTMLFactory {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    withOptions(options) {
        return createHTMLFactory({ ...this.options, ...options });
    }
    ref(resolver) {
        return new RefNode(resolver, this.debugInfo());
    }
    element(tag, ...args) {
        let attributes = {};
        const raw = [...args];
        if (raw.length > 0 && isAttributeMap(raw[0])) {
            attributes = raw.shift();
        }
        else if (raw.length > 0 && isAttributeMap(raw[raw.length - 1])) {
            attributes = raw.pop();
        }
        const children = [];
        raw.forEach(value => normalize(value, children));
        if (voidTags.has(tag.toLowerCase()) && children.length > 0) {
            throw new TypeError(`HTML void element <${tag}> cannot contain children.`);
        }
        return new ElementNode(tag, attributes, children, this.debugInfo());
    }
    debugInfo() {
        if (!this.options.development) {
            return undefined;
        }
        return {
            label: this.options.label,
            creationStack: this.options.captureCreationStacks ? new Error().stack : undefined
        };
    }
}
function createHTMLFactory(options = {}) {
    const target = new HTMLFactory(options);
    return new Proxy(target, {
        get(object, property, receiver) {
            if (typeof property === 'string' && !(property in object)) {
                return (...args) => object.element(property, ...args);
            }
            return Reflect.get(object, property, receiver);
        }
    });
}
export const HTML = createHTMLFactory();
export default HTML;
/*
Design notes
Purpose: Ergonomic HTML-oriented construction while returning only model nodes.
Validation: Structural facts known at factory time fail early; richer rules belong to validation profiles.
Boundary: No document/window/jQuery use. Unsupported rendered objects fail immediately.
TODO: Replace the permissive dynamic tag surface with generated overload declarations if stronger attribute/tag typing proves worthwhile.
*/
