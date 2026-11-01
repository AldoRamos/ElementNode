import type { ContentNode } from '../core/ContentNode.mjs';
import { DOMRenderer } from './DOMRenderer.mjs';

export interface JQueryCollection<TNode extends Node = Node>
{
    readonly length: number;
    readonly [index: number]: TNode;
}

export type JQueryFactory = <TNode extends Node>(node: TNode) => JQueryCollection<TNode>;

export class JQueryRenderer
{
    public constructor(private readonly jquery: JQueryFactory, private readonly domRenderer = new DOMRenderer())
    {
    }

    public render(node: ContentNode): JQueryCollection<Node>
    {
        return this.jquery(this.domRenderer.render(node));
    }
}

/*
Design notes
Purpose: Convenience wrapper downstream of DOMRenderer.
Dependency: The jQuery-compatible factory is injected rather than read from a global `$`.
Boundary: ElementNode neither imports jQuery nor depends on its ambient type declarations.
Usage: Construct with `new JQueryRenderer($)` in an application that already owns jQuery.
TODO: Expand JQueryCollection only if ElementNode itself needs to promise more behavior.
*/
