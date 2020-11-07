import type { CollectionName } from '../collection-name';
/**
 * Transform selected string fields to date
 * @param fields fieldnames without $ prefix
 */
export function dateFromString(...fields: string[]){
    const expr = fields.reduce((acc, x) => Object.assign(acc, {[x]: {$dateFromString: { dateString: `$${x}`}}}), {});
    return [{$addFields: {
        ...expr
    }}];
}

/**
 * Same as lookup, but only use first element from matched array.
 * Collection to join should be in same database.
 * @param from collection to join
 * @param localField local key
 * @param foreignField fieldname to join on foreign collection
 * @param as fieldname
 */
export function join(from: CollectionName, localField: string, foreignField: string, as: string){
    from = Array.isArray(from) ? from[1] : from;
    return [
        {$lookup:{ from, localField, foreignField, as }},
        {$addFields: {
            [as]: {$arrayElemAt: [`$${as}`, 0]}
        }}
    ];
}
/**
 * Wrapper for lookup to work with collection name as array format.
 * Collection to join should be in same database.
 */
export function lookup(from: CollectionName, localField: string, foreignField: string, as: string){
    from = Array.isArray(from) ? from[1] : from;
    return [
        {$lookup:{ from, localField, foreignField, as }},
        {$addFields:{
            [`${as}Count`]: {$size: `$${as}`},
        }},
    ];
}
