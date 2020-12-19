import { diff as calculateDiff, applyChange } from 'deep-diff';
import type { Diff } from 'deep-diff';

export function removeNullValues<T>(obj: T): Partial<T> {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
    const result: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value != null) {
            result[key] = value;
        }
    }
    return result;
}

export type TransformFunc = (key, value) => [any, any];

export function deepTransform(obj, transform: TransformFunc) {
    if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(value => deepTransform(value, transform));
        }
        if (obj instanceof Date) {
            return obj;
        }
        const res = {};
        for (const [key, value] of Object.entries(obj)) {
            const [newKey, newValue] = transform(key, value);
            if (newKey != null) {
                res[newKey] = newValue;
                if (typeof value === 'object') {
                    res[newKey] = deepTransform(newValue, transform);
                }
            }
        }
        return res;
    }
    return obj;
}

type DiffResult<LHS, RHS> = {
    diff: any;
    changes: Diff<LHS, RHS>[];
};
export interface DeepDiffOptions {
    ignore?: string | string[];
}

export function deepDiff<RHS = any, LHS = any>(
    lhs: LHS,
    rhs: RHS,
    opt: DeepDiffOptions = {}
): DiffResult<LHS, RHS> {
    // todo: use deep clone or restrict inner unset
    lhs = { ...lhs };
    rhs = { ...rhs };
    if (opt?.ignore) {
        const ignoreProps = Array.isArray(opt.ignore) ? opt.ignore : [opt.ignore];
        for(const prop of ignoreProps){
            delete lhs[prop];
            delete rhs[prop];
        }
    }
    const changes = calculateDiff(lhs, rhs);
    const diff = applyChanges({}, changes);
    return { diff, changes };
}

export function applyChanges<T = any>(target: T, changes: Diff<T> | Diff<T>[]) {
    if (changes == null) {
        return target;
    }
    changes = Array.isArray(changes) ? changes : [changes];
    for (const change of changes) {
        applyChange(target, null, change);
    }
    return target;
}
