import * as check from './check';

class Validator {
    CustomError: ErrorConstructor;

    constructor(CustomError = Error){
        this.CustomError = CustomError;
    }
    /**
     * Ensure parameter is strict equal to expected value
     * @param {*} obj parameter to check
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isTrue(obj, opt){
        if(obj !== true){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be true.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is strict equal to expected value
     * @param {*} obj parameter to check
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isFalse(obj, opt){
        if(obj !== false){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be false.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is strict equal to expected value
     * @param {*} obj parameter to check
     * @param {*} expected
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isStrictEqual(obj, expected, opt){
        if(obj !== expected){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be strict equal to ${JSON.stringify(expected)}.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is not null or undefined
     * @param {*} obj parameter to check
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isNotNull(obj, opt){
        if(obj == null){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected not to be null.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is not null or empty
     * @param {string|Array|*} obj parameter to check
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isNotEmpty(obj, opt){
        if(check.isEmpty(obj)){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected not to be empty.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is less than threshold
     * @param {number} obj to check
     * @param {number} threshold
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isLessThan(obj, threshold, opt){
        if(check.isLessThan(obj, threshold)){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be less than ${threshold}.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is greater than threshold
     * @param {number} obj to check
     * @param {number} threshold
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isGreaterThan(obj, threshold, opt){
        if(check.isGreaterThan(obj, threshold)){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be greater than ${threshold}.`;

            throw new this.CustomError(msg);
        }
        return obj;
    }
    /**
     * Ensure parameter is included in the source string or array
     * @param {string|*} item array item or substring
     * @param {string|Array} source
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isIncluded(item, source, opt){
        if(!check.includes(source, item)){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be contained in ${JSON.stringify(source)}.`;

            throw new this.CustomError(msg);
        }
        return item;
    }
    /**
     * Ensure parameter is not included in the source string or array
     * @param {string|*} item array item or substring
     * @param {string|Array} source
     * @param {string|Object} [opt] parameter name or options
     * @param {string} [opt.message] message to compose error with
     */
    isNotIncluded(item, source, opt){
        if(check.includes(source, item)){
            const name = opt || 'Required parameter';
            const msg = typeof opt === 'object' && typeof opt.message === 'string' && opt.message
                || `${name} expected to be contained in ${JSON.stringify(source)}.`;

            throw new this.CustomError(msg);
        }
        return item;
    }
}
export const assert = new Validator(Error);
export const validate = new Validator(Error); // todo: use BadRequestError instead
