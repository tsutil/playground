/**
 * @param {number | string | Date} val
 * @param {number} length
 * @param {() => number} [fallbackValue]
 */
function hexBlock(val, length, fallbackValue) {
    if (typeof val === 'function') {
        val = val();
    }
    fallbackValue = fallbackValue != null ? fallbackValue : () => 0;
    val = val != null ? val : fallbackValue();

    if (val instanceof Date) {
        val = val.valueOf();
    }
    if (typeof val === 'string') {
        if (val.length > length) {
            val = val.slice(val.length - length, val.length);
        }
        if (HEX_REGEXP.test(val)) {
            val = val.padStart(length, '0');
        } else {
            val = fallbackValue();
        }
    }
    if (typeof val === 'number') {
        const threshold = 16 ** length;
        const effectiveValue = val % threshold;
        val = effectiveValue.toString(16).padStart(length, '0');
    }
    return val;
}
module.exports.hexBlock = hexBlock;
