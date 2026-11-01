import { ContentNode, type DebugInfo } from './ContentNode.mjs';
export type AttributePrimitive = string | number | boolean | null | undefined;
export type AttributeValue = AttributePrimitive | (() => AttributePrimitive);
export type AttributeMap = Readonly<Record<string, AttributeValue>>;
export declare class ElementNode<K extends string = string> extends ContentNode {
    readonly tag: K;
    readonly attributes: AttributeMap;
    readonly children: readonly ContentNode[];
    constructor(tag: K, attributes?: AttributeMap, children?: readonly ContentNode[], debug?: DebugInfo);
}
