import test from 'tape-promise/tape';
import { buildUrl } from './build-url';

const cases = [
    // [origin, pathName, query, expected]
    ['http://localhost', 'demo', null, 'http://localhost/demo'],
    ['http://127.0.0.1', null, {foo: 'bar'}, 'http://127.0.0.1/?foo=bar'],
    ['http://gh.com', null, null, 'http://gh.com'],
    ['http://gh.com', 'demo/utils', null, 'http://gh.com/demo/utils'],
    ['https://gh.com', null, {foo: 'bar'}, 'https://gh.com/?foo=bar'],
    ['https://gh.com', 'demo/utils', {foo: 'bar'}, 'https://gh.com/demo/utils?foo=bar'],
    ['https://gh.com/demo/', 'utils', {foo: 'bar'}, 'https://gh.com/demo/utils?foo=bar'],
    ['https://gh.com/demo/utils', null, {foo: 'bar'}, 'https://gh.com/demo/utils?foo=bar'],
];
test(`utils.buildUrl()`, async (t) => {
    for (const [origin, pathName, query, expected] of cases) {
        const actual = buildUrl(origin as string, pathName as string, query as any);
        t.strictEqual(actual, expected, `${JSON.stringify([origin, pathName, query])} => ${expected}`);
    }
});
