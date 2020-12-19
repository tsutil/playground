type ValueResolver<TObject, TValue> = (obj: TObject) => TValue;

export function groupBy<TValue, TObject>(
    list: TObject[],
    propertyResolver: string | ValueResolver<TObject, TValue>
): [[any, any]] {
    const map = new Map<TValue, TObject[]>();
    for (const item of list) {
        const value = typeof propertyResolver === 'string'
            ? item[propertyResolver]
            : propertyResolver(item);

        const group = map.get(value);
        if (group == null) {
            map.set(value, [item]);
        } else {
            group.push(item);
        }
    }
    return [...map.entries()] as [[any, any]];
}
