export class ContentNode {
    debug;
    constructor(debug) {
        this.debug = debug;
    }
}
/*
Design notes
Purpose: Base semantic node type. It intentionally carries no DOM behavior.
Operational flow: Factories construct subclasses; renderers/validators consume them.
Boundary: Never import DOM, jQuery, PageVariable, Narrative, or application code here.
TODO: Keep diagnostic metadata optional and semantically inert.
*/
