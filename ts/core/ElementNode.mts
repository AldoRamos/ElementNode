import { ContentNode, type DebugInfo } from './ContentNode.mjs';

export type AttributePrimitive = string | number | boolean | null | undefined;
export type AttributeValue = AttributePrimitive | (() => AttributePrimitive);
export type AttributeMap = Readonly<Record<string, AttributeValue>>;

export class ElementNode<K extends string = string> extends ContentNode
{
    public readonly attributes: AttributeMap;
    public readonly children: readonly ContentNode[];

    public constructor(public readonly tag: K, attributes: AttributeMap = {}, children: readonly ContentNode[] = [], debug?: DebugInfo)
    {
        super(debug);
        if (!tag)
        {
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
