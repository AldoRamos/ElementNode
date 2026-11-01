import { ContentNode } from '../core/ContentNode.mjs';
import { ElementNode } from '../core/ElementNode.mjs';
import { RefNode } from '../core/RefNode.mjs';
export type ContentInput = ContentNode | string | number | null | undefined | readonly ContentInput[];
export interface HTMLFactoryOptions {
    readonly development?: boolean;
    readonly captureCreationStacks?: boolean;
    readonly label?: string;
}
type TagFactory<K extends string> = (...args: readonly unknown[]) => ElementNode<K>;
type BuiltInFactories = {
    readonly [K in keyof HTMLElementTagNameMap]: TagFactory<K>;
};
declare class HTMLFactory {
    private readonly options;
    constructor(options?: HTMLFactoryOptions);
    withOptions(options: HTMLFactoryOptions): HTMLFactory & BuiltInFactories;
    ref<T>(resolver: () => T): RefNode<T>;
    element<K extends string>(tag: K, ...args: readonly unknown[]): ElementNode<K>;
    private debugInfo;
}
export declare const HTML: HTMLFactory & BuiltInFactories;
export default HTML;
