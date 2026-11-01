import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
import type { ValidationIssue, ValidationProfile } from './Validator.mjs';

const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export class HTML5ValidationProfile implements ValidationProfile
{
    public validate(node: ContentNode, path: string): readonly ValidationIssue[]
    {
        const issues: ValidationIssue[] = [];
        this.visit(node, path, issues);
        return issues;
    }

    private visit(node: ContentNode, path: string, issues: ValidationIssue[]): void
    {
        if (node instanceof RefNode)
        {
            return;
        }
        if (!(node instanceof ElementNode))
        {
            return;
        }
        if (voidTags.has(node.tag.toLowerCase()) && node.children.length)
        {
            issues.push({ code: 'HTML_VOID_ELEMENT_CHILDREN', severity: 'error', message: `<${node.tag}> cannot contain children.`, path });
        }
        if (node.tag.toLowerCase() === 'img' && node.attributes.alt === undefined)
        {
            issues.push({ code: 'HTML_IMG_ALT_MISSING', severity: 'warning', message: '<img> should define alt.', path });
        }
        node.children.forEach((child, index) => this.visit(child, `${path}/${node.tag}[${index}]`, issues));
    }
}

/* Design notes: Initial profile intentionally implements only high-value rules; it is extensible rather than pretending to be a complete HTML conformance checker. */
