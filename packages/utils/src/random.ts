import { alphabet, LITERAL_LOWER } from './alphabet';

export function pick<T>(arr: T[]): T {
    return arr[integer(arr.length)];
}

export function pickValue<T>(obj: { [key: string]: T }): T {
    return pick(Object.values(obj));
}

export function stockName() {
    return `Stock-${string(5, alphabet.LITERAL_UPPER)}`;
}

export function serialNumber() {
    return `SN${string(15, alphabet.LITERAL_UPPER)}`;
}

export function skuName() {
    return `SKU Name (${string(6)})`;
}
export function skuVariantCode(length = 10) {
    return `GRB${string(length, alphabet.LITERAL_UPPER)}`;
}

export function salesforceId() {
    return string(18, alphabet.LITERAL_UPPER);
}

export function storeId() {
    return integer(10000000);
}
export function orderId() {
    return integer(100000000);
}
export function orderNumber() {
    return `R${string(9, alphabet.DIGITS)}`;
}
export function customerId() {
    return integer(100000000);
}

export function integer(max = 1000000) {
    return Math.random() * max | 0;
}

export function boolean() {
    return Math.random() > 0.5;
}

export function uuid() {
    return [8, 4, 4, 4, 12].map(x => string(x, alphabet.HEX)).join('-');
}

export function string(length = 10, alphabet: string = LITERAL_LOWER): string {
    if (typeof alphabet !== 'string') {
        throw new Error(`alphabet expected to be a string`);
    }
    const alphabetSize = alphabet.length;
    const chars = [...new Array(length)]
        .map((_, ind) => Math.random() * alphabetSize | 0)
        .map(x => alphabet[x]);

    return chars.join('');
}
