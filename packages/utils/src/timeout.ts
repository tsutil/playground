export function milliseconds<T = any>(
    timeoutMs: number,
    promise: () => Promise<T>,
    errorMessage?: string
): Promise<T> {

    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((resolve, reject) => {
        timeoutHandle = setTimeout(() =>
            reject(new Error(errorMessage)), timeoutMs);
    });

    return Promise.race([
        promise(),
        timeoutPromise,
    ]).then((result) => {
        clearTimeout(timeoutHandle);
        return result;
    });
}

export function seconds<T = any>(
    timeout: number,
    promise: () => Promise<T>,
    errorMessage?: string
): Promise<T> {
    return milliseconds<T>(timeout * 1000, promise, errorMessage);
}
