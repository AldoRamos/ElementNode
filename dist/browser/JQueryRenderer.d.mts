import type { ContentNode } from '../core/ContentNode.mjs';
import { DOMRenderer } from './DOMRenderer.mjs';
export interface JQueryCollection<TNode extends Node = Node> {
    readonly length: number;
    readonly [index: number]: TNode;
}
export type JQueryFactory = <TNode extends Node>(node: TNode) => JQueryCollection<TNode>;
export declare class JQueryRenderer {
    private readonly jquery;
    private readonly domRenderer;
    constructor(jquery: JQueryFactory, domRenderer?: DOMRenderer);
    render(node: ContentNode): JQueryCollection<Node>;
}
