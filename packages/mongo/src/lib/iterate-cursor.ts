import type { Cursor, AggregationCursor } from 'mongodb';

export interface IterateCursorOptions {
    limit?: number;
    batchSize?: number;
}

export async function iterateCursor(
    cursor: Cursor,
    onNext: Function,
    opt: IterateCursorOptions = {}
) {
    let hasNext = await cursor.hasNext();
    let i = 0;
    while (hasNext) {
        i++;
        const item = await cursor.next();
        hasNext = await cursor.hasNext() && (!opt.limit || i < opt.limit);
        await onNext(item);
    }
    return { count: i };
}

export async function iterateCursorBatch(
    cursor: Cursor | AggregationCursor,
    onNext: Function,
    opt: IterateCursorOptions = {},
) {
    const batchSize = opt.batchSize || 200;
    let hasNext = await cursor.hasNext();
    let batch = [], i = 0;
    while (hasNext) {
        i++;
        const item = await cursor.next();
        hasNext = await cursor.hasNext() && (!opt.limit || i < opt.limit);
        batch.push(item);
        if (batch.length >= batchSize) {
            await onNext(batch);
            batch = [];
        }
    }
    if (batch.length > 0) {
        await onNext(batch);
    }
    return { count: i };
}
