import test from 'tape-promise/tape';
import * as reflect from './reflect';

const trivialObjects = [
    null,
    undefined,
    {},
    { demo: 1 },
];

test(`reflect.removeNullValues()`, async (t) => {
    for (const expected of trivialObjects) {
        const actual = reflect.removeNullValues(expected);
        t.deepEqual(actual, expected, `should return same object for ${JSON.stringify(expected)}`);
    }
});

test(`reflect.removeNullValues()`, async (t) => {
    const obj = {
        key: 'value',
        rm1: null,
        rm2: undefined,
    };
    const expected = {
        key: 'value'
    };
    const actual = reflect.removeNullValues(obj);
    t.deepEqual(actual, expected, `should trim null and undefined properties`);
});

test(`reflect.removeNullValues()`, async (t) => {
    const obj = {
        key: 'value',
        rm1: null,
        rm2: undefined,
    };
    reflect.removeNullValues(obj);
    t.deepEqual(obj, obj, `should not mutate input object`);
});

test(`reflect.deepDiff()`, async (t) => {
    const now = new Date();
    const original = {
        a: 1,
        remove: 'me',
        foo: {
            remove: 'me',
            bar: now,
            name: 'original'
        }
    };
    const changed = {
        a: 2,
        foo: {
            bar: now,
            new: 'asdf',
            name: 'changed'
        }
    };
    const expectedDiff = {
        a: 2,
        foo: {
            new: 'asdf',
            name: 'changed'
        }
    };
    const { diff, changes } = reflect.deepDiff(original, changed);
    t.strictEqual(changes?.length, 5, `should return array of changes per each property`);
    t.deepEqual(diff, expectedDiff, `should return simplified diff object`);
});


const deepDiffCases = [
    // old, new, opt, expectedDiff
    [
        { a: 1, b: new Date('2020-01-01')},
        { a: 1, b: new Date('2020-01-01')},
        null,
        {},
    ],
    [
        { a: 1 },
        { a: 1, b: new Date('2020-01-01')},
        null,
        { b: new Date('2020-01-01')},
    ],
    [
        { a: 1 },
        { a: 1, b: new Date('2020-01-01'), c: 123 },
        { ignore: ['b', 'c'] },
        {},
    ],
];

test(`reflect.deepDiff()`, async (t) => {
    for(const [oldState, newState, opt, expected] of deepDiffCases){
        const { diff } = reflect.deepDiff(oldState, newState, opt as any);
        t.deepEqual(diff, expected, `should calculate correct diff obj for ${JSON.stringify(newState)} => ${JSON.stringify(expected)}`);
    }
});
