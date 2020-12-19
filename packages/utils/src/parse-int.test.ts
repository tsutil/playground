import test from 'tape-promise/tape';
import { parseInt } from './parse-int';

const cases = [
    [123, 123],
    [null, null],
    [null, 'asdf'],
    [undefined, undefined],
    [123, 123.1],
    [123, 123.9],
    [123, '123.1'],
    [123, '123.9'],
];

test(`utils.parseInt()`, async (t) => {
    for (const [expected, input] of cases) {
        const actual = parseInt(input);
        t.strictEqual(actual, expected, `should return ${expected} for ${input}`);
    }
});
