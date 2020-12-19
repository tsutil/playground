import test from 'tape-promise/tape';
import { resolveTemplateObject, TEMPLATED_VALUE_REGEX } from './resolve-template-object';

const cases = [
    // context, object, expected_result
    [
        {},
        { a: 1 },
        { a: 1 }
    ], [
        { data: 0 },
        { a: '$data' },
        { a: 0 }
    ], [
        { 'with.dot': 'plain' },
        { a: '$with.dot' },
        { a: 'plain' }
    ], [
        { foo: { bar: 'nested'} },
        { a: '$foo.bar' },
        { a: 'nested' }
    ],
];

test(`resolveTemplateValues()`, async (t) => {
    for (const [context, obj, expected] of cases) {
        const actual = resolveTemplateObject(obj, context);
        t.deepEqual(actual, expected, `should resolve ${JSON.stringify(obj)} to ${JSON.stringify(expected)}`);
    }
});

const validValues = [
    '$foo',
    '$foo.bar',
    '$_foo.bar1',
];
const invalidValues = [
    '',
    '$',
    'asdf',
];
test(`templated value regex`, async (t) => {
    for(const val of validValues){
        t.true(TEMPLATED_VALUE_REGEX.test(val), `should accept ${val}`);
    }
    for(const val of invalidValues){
        t.false(TEMPLATED_VALUE_REGEX.test(val), `should not accept ${val}`);
    }
});
