import test from 'tape-promise/tape';
import { asNumber } from './as-number';

const cases = [
    // [ input, expected ]
    [null, null],
    [undefined, null],
    [0, 0],
    [12, 12],
    ['0', 0],
    ['1.1', 1.1],
    ['007', 7],
    ['0a', null],
    ['0 a', null],
];

test(`utils.asNumber()`, async (t) => {
    for(const [input, expected] of cases){
        const actual = asNumber(input);
        t.strictEqual(actual, expected, `should parse ${JSON.stringify(input)} as ${JSON.stringify(expected)}`);
    }
});
