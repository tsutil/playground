export interface UidSchema {
    timestampLength: number;
    typeLength: number;
    tenantLength: number;
    sequenceLength: number;
    totalLenth: number;
}
export interface UidPayload {
    timestamp: number | string | Date;
    type: number | string;
    tenant: number | string;
    sequence: number | string;
}
export const schema: UidSchema = {
    timestampLength: 11,
    typeLength: 2,
    tenantLength: 2,
    sequenceLength: 5,
    totalLenth: 20,
};
export const VALIDATION_REGEXP = new RegExp(`^[a-f\\d]{${schema.totalLenth}}$`);
export const DEFAULT_TENANT = 1;
const HEX_REGEXP = /^[a-f\d]*$/;

export function isValid(uid: string) {
    return typeof uid === 'string'
        && VALIDATION_REGEXP.test(uid);
}

export function create(opt: Partial<UidPayload> = {}): string {
    const components = [
        hexBlock(opt.timestamp, schema.timestampLength, Date.now),
        hexBlock(opt.tenant, schema.tenantLength, () => DEFAULT_TENANT),
        hexBlock(opt.type, schema.typeLength),
        hexBlock(opt.sequence, schema.sequenceLength, nextSequenceNumber),
    ];
    return components.join('');
}

function hexBlock(val: number | string | Date, length: number, fallbackValue: () => number = () => 0) {
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

function nextSequenceNumber() {
    return Math.floor(Math.random() * 16 ** schema.sequenceLength);
}
