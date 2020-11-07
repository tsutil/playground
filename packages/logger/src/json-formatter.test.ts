import test from 'tape-promise/tape';
import { jsonFormatter } from './json-formatter';

const prefix = 'demo';

test(`logger.jsonFormatter()`, async (t) => {
    const formatter = jsonFormatter(prefix);
    t.true(typeof formatter === 'function', 'should return a function');
});

const cases = [
    [{}, `{"prefix":"${prefix}"}`],
    [{ message: 'msg' }, `{"message":"msg","prefix":"${prefix}"}`],
    [{ foo: 'bar' }, `{"foo":"bar","prefix":"${prefix}"}`],
];

test(`logger.jsonFormatter()`, async (t) => {
    const formatter = jsonFormatter(prefix);
    for (const [input, expected] of cases) {
        const actual = formatter(input);
        t.strictEqual(actual, expected, `should serialize entry: ${expected}`);
    }
});
