import test from 'tape-promise/tape';
import { groupBy } from './group-by';

test(`utils.groupBy()`, async (t) => {
    const items = [
        { a: '1' },
        { a: '1', b: 'asdf' },
        { a: '2' },
    ];
    const expected = [
        ['1', items.slice(0,2)],
        ['2', items.slice(2,3)],
    ];
    const actual = groupBy(items, x => x.a);
    t.deepEqual(actual, expected, 'Should return correct groups');
});
