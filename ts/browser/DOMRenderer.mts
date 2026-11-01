import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
import { TextNode } from '../core/TextNode.mjs';

export class DOMRenderer
{
    public render<K extends keyof HTMLElementTagNameMap>(node: ElementNode<K>): HTMLElementTagNameMap[K];
    public render(node: ContentNode): Node;
    public render(node: ContentNode): Node
    {
        if (node instanceof TextNode)
        {
            return document.createTextNode(node.value);
        }
        if (node instanceof RefNode)
        {
            return this.renderResolved(node.resolve());
        }
        if (node instanceof ElementNode)
        {
            const element = document.createElement(node.tag);
            for (const [name, raw] of Object.entries(node.attributes))
            {
                const value = typeof raw === 'function' ? raw() : raw;
                if (value === undefined || value === null || value === false)
                {
                    continue;
                }
                if (value === true)
                {
                    element.setAttribute(name, '');
                }
                else
                {
                    element.setAttribute(name, String(value));
                }
            }
            node.children.forEach(child => element.append(this.render(child)));
            return element;
        }
        throw new TypeError('Unsupported ContentNode type.');
    }

    private renderResolved(value: unknown): Node
    {
        if (value === null || value === undefined)
        {
            return document.createTextNode('');
        }
        if (value instanceof ContentNode)
        {
            return this.render(value);
        }
        if (Array.isArray(value))
        {
            const fragment = document.createDocumentFragment();
            value.forEach(item => fragment.append(this.renderResolved(item)));
            return fragment;
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
        {
            return document.createTextNode(String(value));
        }
        throw new TypeError('RefNode resolved to an unsupported value.');
    }
}

/*
Design notes
Purpose: Hard boundary between portable content and live browser DOM.
Typing: HTMLElementTagNameMap narrows known tags.
Boundary: DOM values do not flow back into the model.
TODO: Reconciliation/incremental updates remain separate until requirements justify them.
*/
