import { ContentNode } from './ContentNode.mjs';
export class ElementNode extends ContentNode {
    tag;
    attributes;
    children;
    constructor(tag, attributes = {}, children = [], debug) {
        super(debug);
        this.tag = tag;
        if (!tag) {
            throw new TypeError('ElementNode requires a tag.');
        }
        this.attributes = Object.freeze({ ...attributes });
        this.children = Object.freeze([...children]);
    }
}
/*
Design notes
Purpose: Immutable declarative element, never a rendered DOM element.
Typing: K retains the literal tag so browser renderers can narrow their output.
Boundary: Mutation belongs to construction of a new model or a rendered representation.
TODO: Consider immutable transformation helpers only when a concrete use case appears.
*/
