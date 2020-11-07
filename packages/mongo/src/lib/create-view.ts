import { dropCollection } from './drop-collection';
import type { MongoClient } from 'mongodb';

export interface CreateViewOptions {
    dropIfExists?: boolean;
}

export async function createView(
    client: MongoClient,
    nsView: [string, string],
    nsSource: [string, string],
    pipeline: any[],
    opt: CreateViewOptions = {}
) {
    opt = {
        dropIfExists: true,
        ...opt
    };
    const [dbName, viewName] = nsView;
    const [dbNameSource, collectionName] = nsSource;
    if(dbName !== dbNameSource){
        throw new Error('View and Collection must reside withing same database');
    }
    if(!Array.isArray(pipeline)){
        throw new Error('Expected pipeline to be array');
    }

    const db = await client.db(dbName);
    const collection = await db.collection(viewName);

    try {
        return await db.command({ create: viewName, viewOn: collectionName, pipeline });
    } catch (error){
        if(error.codeName === 'NamespaceExists'){
            if(!opt.dropIfExists){
                return null;
            } else {
                await dropCollection(collection);
            }
        }
    }
    return await db.command({ create: viewName, viewOn: collectionName, pipeline });
}
