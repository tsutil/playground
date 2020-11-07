import test from 'tape-promise/tape';
import { sanitizeCollectionName } from './sanitize-collection-name';

const cases = [
    // [input, expected]
    ['as-DF', 'as-DF'],
    ['$/media/lib', '__media_lib'],
    ['demo 123', 'demo_123'],
    ['2019-05: sales', '2019-05__sales'],
];

test(`mongo.sanitizeCollectionName()`, async (t) => {
    for(const [input, expected] of cases){
        const actual = sanitizeCollectionName(input);
        t.deepEqual(actual, expected, `should transform ${JSON.stringify(input)} into ${JSON.stringify(expected)}`);
    }
});
