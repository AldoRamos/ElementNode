export class Validator {
    profile;
    constructor(profile) {
        this.profile = profile;
    }
    validate(node) {
        const issues = [...this.profile.validate(node, '$')];
        return Object.freeze({ valid: !issues.some(issue => issue.severity === 'error'), issues: Object.freeze(issues) });
    }
}
