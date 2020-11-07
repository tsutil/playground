import type { Collection } from 'mongodb';

export async function copyIndexes(source: Collection, destination: Collection) {
    const indexes = await source.listIndexes().toArray();
    for (const options of indexes) {
        const key = options.key;
        delete options.key;
        delete options.v;
        delete options.ns;
        options.name = `${destination.collectionName}_${Object.keys(key).join('_')}`;
        await destination.createIndex(key, options);
    }
    return await destination.listIndexes().toArray();
}
