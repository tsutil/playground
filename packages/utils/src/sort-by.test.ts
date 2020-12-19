import test from 'tape-promise/tape';
import { sortBy } from './index';

const cases = [
    // [input, expected, message]
    [[5, 2, 3, 2, 4], [2, 2, 3, 4, 5], 'should use asc order by default'],
    [[4, null, 3, null], [3, 4, null, null], 'should put nulls at the end'],
];

test(`utils.sortBy()`, async (t) => {
    for (const [input, expected, message] of cases) {
        const actual = sortBy(input as any, x => x);
        t.deepEqual(actual, expected, message as string);
    }
});

test(`utils.sortBy()`, async (t) => {
    const input = [
        { a: 1 },
        { a: 0 }
    ];
    const expected = [
        { a: 0 },
        { a: 1 }
    ];
    const actual = sortBy(input as any, x => x.a);
    t.deepEqual(actual, expected, 'should allow use prop selectors');
});
