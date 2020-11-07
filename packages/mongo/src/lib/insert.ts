import { errorCodes } from './error-codes';
import type { Collection } from 'mongodb';

export interface InsertResult {
    count?: number;
    insertedKeys?: any[];
    inserted?: any[];
}

export async function insert(
    collection: Collection,
    documents: any | any[],
): Promise<InsertResult> {
    documents = Array.isArray(documents) && documents || [documents];
    let res: any = {};
    try {
        // @ts-ignore - checkKeys is not in typings
        res = await collection.insertMany(documents, { ordered: false, checkKeys: false });
    } catch (error) {
        // if inserted count = 0 even { ordered: false } will not prevent error
        if (error.code !== errorCodes.DUPLICATE_KEY) {
            throw error;
        }
    }
    return {
        count: res.insertedCount || 0,
        insertedKeys: Object.values(res.insertedIds || {}),
        inserted: res.ops || []
    };
}
