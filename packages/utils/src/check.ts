export function isNull(param) {
    return param == null;
}

export function isEmpty(param) {
    if (param == null) return true;
    if (typeof param === 'string') return param === '';
    if (Array.isArray(param)) return param.length === 0;
    if (typeof param === 'object') return param.constructor === Object && Object.keys(param).length === 0;
    return false;
}

export function isLessThan(param, threshold) {
    return typeof param === 'number'
        && typeof threshold === 'number'
        && param < threshold;
}

export function isGreaterThan(param, threshold) {
    return typeof param === 'number'
        && typeof threshold === 'number'
        && param > threshold;
}

export function includes(source, item) {
    if (source == null) return false;
    if (typeof source === 'string') return source.includes(item);
    if (Array.isArray(source)) return source.includes(item);
    return false;
}