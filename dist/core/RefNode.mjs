import { ContentNode } from './ContentNode.mjs';
export class RefNode extends ContentNode {
    resolve;
    constructor(resolve, debug) {
        super(debug);
        this.resolve = resolve;
    }
}
export function ref(resolve) {
    return new RefNode(resolve);
}
/*
Design notes
Purpose: Deferred, renderer-independent resolution.
Integration: Callbacks allow PageVariable or any other state source to participate without coupling.
Compromise: Reactive subscription is deliberately not part of RefNode 0.1.
TODO: If live synchronization is needed, prefer an external integration layer.
*/
