import { ContentNode } from './ContentNode.mjs';
export class TextNode extends ContentNode {
    value;
    constructor(value, debug) {
        super(debug);
        this.value = value;
    }
}
