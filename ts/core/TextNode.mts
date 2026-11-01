import { ContentNode, type DebugInfo } from './ContentNode.mjs';

export class TextNode extends ContentNode
{
    public constructor(public readonly value: string, debug?: DebugInfo)
    {
        super(debug);
    }
}
