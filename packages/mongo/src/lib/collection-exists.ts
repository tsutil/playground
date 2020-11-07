import type { Collection } from 'mongodb';

export async function collectionExists(collection: Collection) {
    try {
        await collection.stats();
        return true;
    } catch (err) {
        if (err.errmsg && err.errmsg.indexOf('not found')) {
            return false;
        }
        throw err;
    }
}
