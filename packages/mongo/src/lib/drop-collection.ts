import type { Collection } from 'mongodb';

export async function dropCollection(collection: Collection) {
    try {
        return await collection.drop();
    } catch (error) {
        if (error.codeName === 'NamespaceNotFound') {
            return null;
        }
        throw error;
    }
}
