/**
 * Replacer for json serializer to correctly serialize errors
 */
export function serializableErrorReplacer(key: string, value: any): any {
    const isError = value instanceof Error;
    if (!isError) {
        return value;
    }
    let result: any = {};
    for (const key of Object.getOwnPropertyNames(value)) {
        if (key === 'stack') {
            result[key] = parseErrorStack(value[key]);
        } else {
            result[key] = value[key];
        }
    }
    return result;
}

/**
 * Transform convert error properties to serializable objects
 */
export function serializableError(obj: any): any {
    const isError = obj instanceof Error;
    if (!isError) {
        const errorEntry = Object.entries(obj)
            .find(([key, val]) => val instanceof Error);

        if (errorEntry == null) {
            return obj;
        }
        const [key, val] = errorEntry;
        return {
            ...obj,
            [key]: serializableError(val)
        };
    }
    let result: any = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
        if (key === 'stack') {
            result[key] = parseErrorStack(obj[key]);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

function parseErrorStack(stack: string) {
    return stack
        .split('\n')
        .filter(x => x.trim().slice(0, 5) != 'Error')
        .map((x, i) => `stack ${i} ${x.trim().slice(3).trim()}`);
}
