import { iterateCursorBatch } from './iterate-cursor';
import { dropCollection } from './drop-collection';
import { copyIndexes } from './copy-indexes';
import { insert } from './insert';
import type { Collection } from 'mongodb';

export interface CopyCollectionOptions {
    dropIfExists?: boolean;
    copyIndexes?: boolean;
}

export async function copyCollection(
    source: Collection,
    destination: Collection,
    opt: CopyCollectionOptions = {}
) {
    if (opt.dropIfExists) {
        await dropCollection(destination);
    }
    const cursor = source.find();
    await iterateCursorBatch(cursor, async batch => await insert(destination, batch));
    if (opt.copyIndexes) {
        await copyIndexes(source, destination);
    }
    return destination;
}
