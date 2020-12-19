import test from 'tape-promise/tape';
import * as path from 'path';
import * as temp from './temp';

test(`temp.file()`, async (t) => {
    const relative = 'foo/bar/baz.js';
    const expected = path.join(temp.directory(), relative);
    const actual = temp.file('foo', 'bar', 'baz.js');
    t.strictEqual(actual, expected, 'Should return path in temp directory');
});
