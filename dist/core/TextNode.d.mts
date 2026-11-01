import { ContentNode, type DebugInfo } from './ContentNode.mjs';
export declare class TextNode extends ContentNode {
    readonly value: string;
    constructor(value: string, debug?: DebugInfo);
}
