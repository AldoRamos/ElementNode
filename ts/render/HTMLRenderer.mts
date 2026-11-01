import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode, type AttributePrimitive } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
import { TextNode } from '../core/TextNode.mjs';
import type { Renderer } from './Renderer.mjs';

const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const escapeText = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeAttribute = (value: string) => escapeText(value).replaceAll('"', '&quot;');

export class HTMLRenderer implements Renderer<string>
{
    public render(node: ContentNode): string
    {
        if (node instanceof TextNode)
        {
            return escapeText(node.value);
        }
        if (node instanceof RefNode)
        {
            return this.renderResolved(node.resolve());
        }
        if (node instanceof ElementNode)
        {
            const attributes = Object.entries(node.attributes).map(([name, raw]) => this.attribute(name, typeof raw === 'function' ? raw() : raw)).join('');
            const open = `<${node.tag}${attributes}>`;
            if (voidTags.has(node.tag.toLowerCase()))
            {
                return open;
            }
            return `${open}${node.children.map(child => this.render(child)).join('')}</${node.tag}>`;
        }
        throw new TypeError('Unsupported ContentNode type.');
    }

    private renderResolved(value: unknown): string
    {
        if (value === null || value === undefined)
        {
            return '';
        }
        if (value instanceof ContentNode)
        {
            return this.render(value);
        }
        if (Array.isArray(value))
        {
            return value.map(item => this.renderResolved(item)).join('');
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
        {
            return escapeText(String(value));
        }
        throw new TypeError('RefNode resolved to an unsupported value.');
    }

    private attribute(name: string, value: AttributePrimitive): string
    {
        if (value === undefined || value === null || value === false)
        {
            return '';
        }
        if (value === true)
        {
            return ` ${name}`;
        }
        if (typeof value === 'number')
        {
            return ` ${name}=${value}`;
        }
        return ` ${name}=\"${escapeAttribute(value)}\"`;
    }
}

/* Design notes: Pure string renderer; intentionally requires no browser globals. Numeric attributes serialize unquoted by project convention. */
