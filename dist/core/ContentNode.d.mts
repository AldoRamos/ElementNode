export interface DebugInfo {
    readonly label?: string;
    readonly creationStack?: string;
}
export declare abstract class ContentNode {
    readonly debug?: DebugInfo;
    protected constructor(debug?: DebugInfo);
}
