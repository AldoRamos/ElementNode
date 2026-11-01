import { ContentNode, type DebugInfo } from './ContentNode.mjs';
export declare class RefNode<T = unknown> extends ContentNode {
    readonly resolve: () => T;
    constructor(resolve: () => T, debug?: DebugInfo);
}
export declare function ref<T>(resolve: () => T): RefNode<T>;
