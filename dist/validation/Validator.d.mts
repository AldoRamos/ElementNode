import { ContentNode } from '../core/ContentNode.mjs';
export type ValidationSeverity = 'warning' | 'error';
export interface ValidationIssue {
    readonly code: string;
    readonly severity: ValidationSeverity;
    readonly message: string;
    readonly path?: string;
}
export interface ValidationReport {
    readonly valid: boolean;
    readonly issues: readonly ValidationIssue[];
}
export interface ValidationProfile {
    validate(node: ContentNode, path: string): readonly ValidationIssue[];
}
export declare class Validator {
    private readonly profile;
    constructor(profile: ValidationProfile);
    validate(node: ContentNode): ValidationReport;
}
