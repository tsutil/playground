import test from 'tape-promise/tape';
import * as uid from './uid';

test(`uid.create()`, async (t) => {
    const actual = uid.create();
    t.true(uid.isValid(actual), 'Should return valid uid');
    t.true(uid.VALIDATION_REGEXP.test(actual), 'Should comply validation regex');
});

test(`uid.create({ sequence })`, async (t) => {
    const sequenceValue = '12';
    const expectedSuffix = sequenceValue.toString().padStart(uid.schema.sequenceLength, '0');
    const actual = uid.create({ sequence: sequenceValue });
    t.true(uid.isValid(actual), 'Should return valid uid');
    t.true(actual.endsWith(expectedSuffix), 'Should end with padded sequence string');
});

