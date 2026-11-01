import assert from 'node:assert/strict';
import test from 'node:test';
import { HTML, HTMLRenderer } from '../dist/index.mjs';

test('builds and renders a typed content tree', () => {
    const tree = HTML.div({ id: 'root' }, HTML.span('Hello'), HTML.option('Five', { value: 5 }));
    assert.equal(new HTMLRenderer().render(tree), '<div id="root"><span>Hello</span><option value=5>Five</option></div>');
});

test('rejects children of void elements early', () => {
    assert.throws(() => HTML.img('invalid', { alt: 'x' }), /cannot contain children/);
});
