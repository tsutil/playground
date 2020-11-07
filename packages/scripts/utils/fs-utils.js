// @ts-check
const fs = require('fs-extra');

/** @typedef RegexFilterProps
 * @property {RegExp[]} [include]
 * @property {RegExp[]} [exclude]
 */

/** @typedef StringFilterParams
 * @property {string | string[]} [include]
 * @property {string | string[]} [exclude]
 */

/** @typedef {(path: string) => boolean} PathFilter */


/**
 * Copy file or directory recursively
 * @param {string} source
 * @param {string} destination
 * @param {StringFilterParams} [opt]
 */
async function copy(source, destination, opt = {}) {
    const filter = createPathFilter(opt);
    await fs.copy(source, destination, { filter, recursive: true });
}
module.exports.copy = copy;

/**
 * @param {StringFilterParams} opt
 * @returns {PathFilter}
 */
function createPathFilter(opt = {}) {
    const regexFilterParams = {
        exclude: regexpArray(opt.exclude),
        include: regexpArray(opt.include),
    };
    return (str) => filterPath(str, regexFilterParams);
}

/**
 * @param {string} path
 * @param {RegexFilterProps} props
 */
function filterPath(path, props) {
    for (const excludeRegex of props.exclude) {
        if (excludeRegex.test(path)) {
            return false;
        }
    }
    if (props.include.length) {
        const stats = fs.statSync(path);
        if(stats.isDirectory){
            return true;
        }
        return props.include.some(r => r.test(path));
    }
    return true;
}

/**
 * @param {string|string[]} expression
 */
function regexpArray(expression) {
    if (expression == null) {
        return [];
    }
    expression = Array.isArray(expression) ? expression : [expression];
    // console.log(expression);
    return expression.map(x => new RegExp(x));
}
