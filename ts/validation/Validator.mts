import { ContentNode } from '../core/ContentNode.mjs';

export type ValidationSeverity = 'warning' | 'error';
export interface ValidationIssue
{
    readonly code: string;
    readonly severity: ValidationSeverity;
    readonly message: string;
    readonly path?: string;
}
export interface ValidationReport
{
    readonly valid: boolean;
    readonly issues: readonly ValidationIssue[];
}
export interface ValidationProfile
{
    validate(node: ContentNode, path: string): readonly ValidationIssue[];
}

export class Validator
{
    public constructor(private readonly profile: ValidationProfile)
    {
    }

    public validate(node: ContentNode): ValidationReport
    {
        const issues = [...this.profile.validate(node, '$')];
        return Object.freeze({ valid: !issues.some(issue => issue.severity === 'error'), issues: Object.freeze(issues) });
    }
}
