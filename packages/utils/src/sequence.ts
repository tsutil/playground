export function createString(pattern: string | (() => string), seed = 1) {
    return {
        next: function () {
            const str = typeof pattern === 'string' ? pattern : pattern();
            const ind = (seed++).toString();
            return str.indexOf('#') >= 0 ? str.replace('#', ind) : str + ind;
        }
    };
}
/**
 * Returns array with sequential numbers (e.g. [0,1,2])
 * @param size number of elements in an array
 */
export function intArray(size: number): number[] {
    return [...new Array(size)].map((_, i) => i);
}
