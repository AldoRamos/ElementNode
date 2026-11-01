import { ContentNode } from '../core/ContentNode.mjs';
import type { ValidationIssue, ValidationProfile } from './Validator.mjs';
export declare class HTML5ValidationProfile implements ValidationProfile {
    validate(node: ContentNode, path: string): readonly ValidationIssue[];
    private visit;
}
