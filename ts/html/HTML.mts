import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode, type AttributeMap } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
import { TextNode } from '../core/TextNode.mjs';

export type ContentInput = ContentNode | string | number | null | undefined | readonly ContentInput[];
export interface HTMLFactoryOptions
{
    readonly development?: boolean;
    readonly captureCreationStacks?: boolean;
    readonly label?: string;
}

type TagFactory<K extends string> = (...args: readonly unknown[]) => ElementNode<K>;
type BuiltInFactories = { readonly [K in keyof HTMLElementTagNameMap]: TagFactory<K> };

const attributeKeys = new Set(['id', 'class', 'className', 'name', 'value', 'src', 'alt', 'href', 'title', 'type', 'role', 'disabled', 'selected', 'checked', 'data', 'aria']);
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

function isAttributeMap(value: unknown): value is AttributeMap
{
    if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof ContentNode)
    {
        return false;
    }
    return Object.keys(value as object).some(key => attributeKeys.has(key) || key.startsWith('data-') || key.startsWith('aria-')) || Object.keys(value as object).length === 0;
}

function normalize(input: ContentInput, output: ContentNode[]): void
{
    if (input === null || input === undefined)
    {
        return;
    }
    if (Array.isArray(input))
    {
        input.forEach(item => normalize(item, output));
        return;
    }
    if (input instanceof ContentNode)
    {
        output.push(input);
        return;
    }
    if (typeof input === 'string' || typeof input === 'number')
    {
        output.push(new TextNode(String(input)));
        return;
    }
    throw new TypeError('Unsupported ContentNode child. Rendered DOM and jQuery objects are not valid model children.');
}

class HTMLFactory
{
    public constructor(private readonly options: HTMLFactoryOptions = {})
    {
    }

    public withOptions(options: HTMLFactoryOptions): HTMLFactory & BuiltInFactories
    {
        return createHTMLFactory({ ...this.options, ...options });
    }

    public ref<T>(resolver: () => T): RefNode<T>
    {
        return new RefNode(resolver, this.debugInfo());
    }

    public element<K extends string>(tag: K, ...args: readonly unknown[]): ElementNode<K>
    {
        let attributes: AttributeMap = {};
        const raw = [...args];
        if (raw.length > 0 && isAttributeMap(raw[0]))
        {
            attributes = raw.shift() as AttributeMap;
        }
        else if (raw.length > 0 && isAttributeMap(raw[raw.length - 1]))
        {
            attributes = raw.pop() as AttributeMap;
        }
        const children: ContentNode[] = [];
        raw.forEach(value => normalize(value as ContentInput, children));
        if (voidTags.has(tag.toLowerCase()) && children.length > 0)
        {
            throw new TypeError(`HTML void element <${tag}> cannot contain children.`);
        }
        return new ElementNode(tag, attributes, children, this.debugInfo());
    }

    private debugInfo()
    {
        if (!this.options.development)
        {
            return undefined;
        }
        return {
            label: this.options.label,
            creationStack: this.options.captureCreationStacks ? new Error().stack : undefined
        };
    }
}

function createHTMLFactory(options: HTMLFactoryOptions = {}): HTMLFactory & BuiltInFactories
{
    const target = new HTMLFactory(options);
    return new Proxy(target as HTMLFactory & BuiltInFactories, {
        get(object, property, receiver)
        {
            if (typeof property === 'string' && !(property in object))
            {
                return (...args: readonly unknown[]) => object.element(property, ...args);
            }
            return Reflect.get(object, property, receiver);
        }
    });
}

export const HTML = createHTMLFactory();
export default HTML;

/*
Design notes
Purpose: Ergonomic HTML-oriented construction while returning only model nodes.
Validation: Structural facts known at factory time fail early; richer rules belong to validation profiles.
Boundary: No document/window/jQuery use. Unsupported rendered objects fail immediately.
TODO: Replace the permissive dynamic tag surface with generated overload declarations if stronger attribute/tag typing proves worthwhile.
*/
