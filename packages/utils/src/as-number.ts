export function asNumber(value): number {
    return value != null && !isNaN(value)
        ? Number(value)
        : null;
}
