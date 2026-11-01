import { ContentNode, type DebugInfo } from './ContentNode.mjs';

export class RefNode<T = unknown> extends ContentNode
{
    public constructor(public readonly resolve: () => T, debug?: DebugInfo)
    {
        super(debug);
    }
}

export function ref<T>(resolve: () => T): RefNode<T>
{
    return new RefNode(resolve);
}

/*
Design notes
Purpose: Deferred, renderer-independent resolution.
Integration: Callbacks allow PageVariable or any other state source to participate without coupling.
Compromise: Reactive subscription is deliberately not part of RefNode 0.1.
TODO: If live synchronization is needed, prefer an external integration layer.
*/
