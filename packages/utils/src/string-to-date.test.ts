import test from 'tape-promise/tape';
import { parseDate } from './string-to-date';

const valid = [
    '2020-05-01',
    '2020-05-01T12:17:22Z',
    '2020-05-01T12:17:22.416Z',
    '2020-05-01T12:17:22.416+00:00',
];
const invalid = [
    null,
    undefined,
    123,
    'Yesterday',
    '2020-05',
    '2020',
];

test(`utils.parseDate()`, async (t) => {
    for (const value of valid) {
        const parsed = parseDate(value);
        const isDate = parsed instanceof Date;
        t.equal(isDate, true, `Should correctly parse ${JSON.stringify(value)}`);
    }
    for (const value of invalid) {
        const parsed = parseDate(value);
        const isInvalid = parsed == null;
        t.equal(isInvalid, true, `Should return null for invalid date ${JSON.stringify(value)}`);
    }
});
