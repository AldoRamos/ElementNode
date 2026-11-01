import type { ContentNode } from '../core/ContentNode.mjs';
export interface Renderer<T> {
    render(node: ContentNode): T;
}
