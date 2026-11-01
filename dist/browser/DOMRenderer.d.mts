import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode } from '../core/ElementNode.mjs';
export declare class DOMRenderer {
    render<K extends keyof HTMLElementTagNameMap>(node: ElementNode<K>): HTMLElementTagNameMap[K];
    render(node: ContentNode): Node;
    private renderResolved;
}
