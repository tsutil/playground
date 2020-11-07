import { copyCollection } from './copy-collection';
import type { Db } from 'mongodb';

export interface CopyDatabaseOptions {
    dropIfExists?: boolean;
    copyIndexes?: boolean;
}

export async function copyDatabase(
    source: Db,
    destination: Db,
    opt: CopyDatabaseOptions = {},
) {
    const collectionNames = await source.listCollections().toArray();
    for (const collectionName of collectionNames) {
        const sourceCollection = source.collection(collectionName.name);
        const destinationCollection = destination.collection(collectionName.name);
        await copyCollection(sourceCollection, destinationCollection, opt);
    }
}
