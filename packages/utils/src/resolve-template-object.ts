import { get } from 'lodash';
import { deepTransform } from './reflect';
export const TEMPLATED_VALUE_REGEX = /^\$[\w\.]+$/;

export function resolveTemplateObject(obj, context) {
    if (context == null) {
        return obj;
    }
    const transform = (key, value) => {
        if (typeof value === 'string' && TEMPLATED_VALUE_REGEX.test(value)) {
            const path = value.slice(1);
            value = context[path];
            if(value === undefined) {
                value = get(context, path);
            }
        }
        return [key, value] as [any, any];
    };
    obj = deepTransform(obj, transform);
    return obj;
}

