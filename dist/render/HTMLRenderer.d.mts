import { ContentNode } from '../core/ContentNode.mjs';
import type { Renderer } from './Renderer.mjs';
export declare class HTMLRenderer implements Renderer<string> {
    render(node: ContentNode): string;
    private renderResolved;
    private attribute;
}
