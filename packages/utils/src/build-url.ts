import { URL } from 'url';
import { stringify } from 'querystring';

/**
 * @param origin base uri
 * @param pathname url path (e.g. foo/bar)
 * @param query query parameters
 */
export function buildUrl(
    origin: string,
    pathname?: string,
    query?: { [key: string]: any }
): string {

    pathname = pathname != null ? pathname : '';
    const url = new URL(pathname, origin);
    if (typeof query === 'object') {
        url.search = stringify(query);
    }
    return url.toString().replace(/\/$/, '');
}
