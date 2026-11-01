# ElementNode

ElementNode is a TypeScript content-tree model for describing structured content independently of its rendered representation.

```ts
const content = HTML.div(
    HTML.h1('Project Summary'),
    HTML.p('Current project status')
);
```

The result is a model tree, not live DOM. A renderer materializes it as DOM, HTML text, or a jQuery collection.

## Architectural rule

**PageVariable owns state. ElementNode owns content. Renderers own materialization. An application or integration layer owns synchronization between them.**

ElementNode and PageVariable are deliberately independent. ElementNode accepts ordinary callbacks for deferred values, so a consumer may reference `pageVariable.value` without either package importing the other.

## Design goals

- Rendering independence: core nodes do not depend on DOM, jQuery, Narrative, or PageVariable.
- Strong typing: `HTML.select()` is `ElementNode<'select'>`; `DOMRenderer` maps it to `HTMLSelectElement`.
- Declarative content: model first, render deliberately.
- Deferred values: `RefNode` resolves content or attribute values later.
- Early validation: detect errors as soon as sufficient information exists.
- Scoped diagnostics: factory and render/validation options, never mutable global debug state.
- Portability: HTML-string rendering works without `window` or `document`.

## Module convention

Source files use `.mts`; emitted ECMAScript modules use `.mjs`. Internal relative imports explicitly name the runtime `.mjs` path. Package imports are suffixless through package exports.

```ts
// Inside this package
import { ContentNode } from './core/ContentNode.mjs';

// From a consumer
import { HTML, ElementNode } from 'element-node';
import { DOMRenderer } from 'element-node/browser';
```

## Public API

### Root package

```ts
import {
    ContentNode,
    ElementNode,
    TextNode,
    RefNode,
    ref,
    HTML,
    HTMLRenderer
} from 'element-node';
```

### Browser boundary

```ts
import { DOMRenderer, JQueryRenderer } from 'element-node/browser';

const jqueryRenderer = new JQueryRenderer($);
```

`JQueryRenderer` is downstream of `DOMRenderer` and receives the application-owned jQuery factory through its constructor. ElementNode has no ambient `$` or `JQuery` type dependency. jQuery objects are rendered artifacts and are never valid ContentNode children.

### Validation

```ts
import { Validator, HTML5ValidationProfile } from 'element-node/validation';
```

## Example

```ts
import { HTML, HTMLRenderer } from 'element-node';

const project = { name: 'Narrative' };
const content = HTML.div(
    HTML.h1(HTML.ref(() => project.name)),
    HTML.img({ src: 'logo.png', alt: 'Logo' })
);

console.log(new HTMLRenderer().render(content));
```

## Package boundaries

| Area | May use | Must not use |
|---|---|---|
| `core` | JavaScript/TypeScript primitives | DOM, jQuery, PageVariable, Narrative |
| `html` | `core` | DOM, jQuery, application code |
| `render` | `core` | browser globals |
| `validation` | `core`, HTML rules | application code |
| `browser` | core/render, browser APIs | Narrative, PageVariable |

Dependencies flow toward `core`; `core` never imports outward.

## Validation phases

1. Construction catches errors already knowable, including children on void elements and unsupported child objects.
2. Resolution/rendering catches errors depending on `RefNode` values.
3. Explicit validation traverses a complete tree and returns a report.

## Deferred synchronization

Version 0.1 does not attempt reactive DOM synchronization. This is intentional. A PageVariable can be consumed through a resolver:

```ts
HTML.span(HTML.ref(() => projectName.value));
```

A future integration layer may coordinate subscriptions and incremental updates without coupling ElementNode to PageVariable.

## Current scope / TODO

- Broaden HTML5 structural and attribute validation beyond the initial high-value rules.
- Decide whether immutable structural transforms deserve first-class helpers.
- Evaluate keyed reconciliation/incremental rendering only after real application requirements exist.
- Keep reactive synchronization outside the core unless a renderer-independent abstraction proves necessary.
