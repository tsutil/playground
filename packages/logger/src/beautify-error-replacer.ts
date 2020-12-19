/**
 * Replacer for json serializer to correctly serialize errors
 */

export function beautifyErrorReplacer(key: string, value: any): any {
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

function parseErrorStack(stack: string) {
    return stack
        .split('\n')
        .filter(x => x.trim().slice(0, 5) != 'Error')
        .map((x, i) => `stack ${i} ${x.trim().slice(3).trim()}`);
}
