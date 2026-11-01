import { DOMRenderer } from './DOMRenderer.mjs';
export class JQueryRenderer {
    jquery;
    domRenderer;
    constructor(jquery, domRenderer = new DOMRenderer()) {
        this.jquery = jquery;
        this.domRenderer = domRenderer;
    }
    render(node) {
        return this.jquery(this.domRenderer.render(node));
    }
}
/*
Design notes
Purpose: Convenience wrapper downstream of DOMRenderer.
Dependency: The jQuery-compatible factory is injected rather than read from a global `$`.
Boundary: ElementNode neither imports jQuery nor depends on its ambient type declarations.
Usage: Construct with `new JQueryRenderer($)` in an application that already owns jQuery.
TODO: Expand JQueryCollection only if ElementNode itself needs to promise more behavior.
*/
