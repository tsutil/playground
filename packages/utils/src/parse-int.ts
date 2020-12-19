const INT_REGEX = /\d/;

/**
 * Returs Math.floor or Number.parseInt based on argument type.
 * Returns null if invalid string is supplied
 */
export function parseInt(value: string | number | any) {
    if (value == null) {
        return value;
    }
    if (typeof value === 'number') {
        return Math.floor(value);
    }
    if (typeof value === 'string' && INT_REGEX.test(value)) {
        const res = Number.parseInt(value);
        return Number.isNaN(res) ? null : res;
    }
    return null;
}
