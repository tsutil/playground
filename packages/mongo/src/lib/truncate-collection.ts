import { collectionExists } from './collection-exists';
import type { Collection } from 'mongodb';

export async function truncateCollection(collection: Collection) {
    let indexes = [];
    if (!(await collectionExists(collection))) {
        return collection;
    }
    indexes = await collection.indexes();
    await collection.drop();
    for (const index of indexes) {
        const key = index.key;
        delete index.key;
        delete index.v;
        delete index.ns;
        await collection.createIndex(key, index);
    }
    return collection;
}
