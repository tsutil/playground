import { MongoClient, IndexOptions, UpdateManyOptions, UpdateOneOptions } from 'mongodb';
import { errorCodes } from './lib/error-codes';
import { CollectionName } from './collection-name';
import * as lib from './lib';

const DEFAULT_MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'test';
const DEFAULT_MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost';

const _instances: Map<string, any> = new Map();

export interface MongoStorageOptions {
    connectionString: string;
}

export class MongoStorage {
    static instance(opt?: MongoStorageOptions | string) {
        opt = opt == null ? DEFAULT_MONGO_CONNECTION_STRING : opt;
        const key = typeof opt === 'string' && opt
            || typeof opt === 'object' && opt.connectionString
            || 'default';

        let instance = _instances.get(key) as MongoStorage;
        if (instance == null) {
            instance = new MongoStorage(opt);
            _instances.set(key, instance);
        }
        return instance;
    }
    static async disconnect() {
        for (const [key, instance] of _instances.entries()) {
            typeof instance.disconnect === 'function'
                && await instance.disconnect();
        }
    }
    lib;
    _client: MongoClient;
    _url: string;
    _dbName: string;

    constructor(opt: MongoStorageOptions | string) {
        const connectionString = typeof opt === 'object' && opt.connectionString
            || typeof opt === 'string' && opt
            || DEFAULT_MONGO_CONNECTION_STRING;

        this._client;
        this._url = connectionString;
        //todo: get from connection string if specified
        this._dbName = DEFAULT_MONGO_DB_NAME;
    }
    use(dbName) {
        // todo: return new Storage instance - clone settings, reuse connection
        this._dbName = dbName || DEFAULT_MONGO_DB_NAME;
        return this;
    }
    async connect() {
        if (this._client != null) {
            return this._client;
        }
        this._client = await MongoClient.connect(this._url, {
            minSize: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketOptions: {
                socketTimeoutMS: 5 * 60 * 60 * 1000,
                connectTimeoutMS: 5 * 60 * 60 * 1000,
            }
        });
        return this._client;
    }
    async disconnect() {
        if (this._client == null) return;
        const client = this._client;
        this._client = null;
        await client.close();
    }
    listenEvents() {
        process.on('SIGTERM', () => this.disconnect());
        process.on('SIGINT', () => this.disconnect());
    }
    async db(name = this._dbName) {
        const client = await this.connect();
        if (!name) {
            throw new Error('Db name should not be empty');
        }
        return client.db(name);
    }
    async collection(name: CollectionName) {
        let dbName: string;
        if (Array.isArray(name)) {
            [dbName, name] = name;
        }
        if (!name) {
            throw new Error('Collection name should not be empty');
        }
        const db = await this.db(dbName);
        return db.collection(name);
    }
    /**
     * Insert one or many documents into collection
     */
    async insert(name: CollectionName, documents: any | any[]) {
        documents = Array.isArray(documents) && documents || [documents];
        const collection = await this.collection(name);
        return await lib.insert(collection, documents);
    }

    async updateMany(name: CollectionName, filter, update, options?: UpdateManyOptions) {
        const col = await this.collection(name);
        return await col.update(filter, update, options);
    }

    async updateOne(name: CollectionName, filter, update, options?: UpdateOneOptions) {
        const col = await this.collection(name);
        return await col.updateOne(filter, update, options);
    }
    // todo: refactor out
    /**
     * Upsert one or many documents
     */
    async upsert(name: CollectionName, documents, uniqueField = '_id') {
        documents = Array.isArray(documents) && documents || [documents];
        if (uniqueField === '_id') {
            for (const document of documents) {
                if (document._id === undefined) {
                    document._id = document.id || document.Id;
                }
            }
        }
        const collection = await this.collection(name);
        let insertedDocuments = undefined;
        let inserted = new Set(documents.map(x => x[uniqueField]));
        const replaced = new Set();
        try {
            if (documents.length) {
                const res = await collection.insertMany(documents, { ordered: false, checkKeys: false });
                inserted = new Set(Object.values(res.insertedIds));
                insertedDocuments = res.ops;
            }
        } catch (error) {
            if (error.code !== errorCodes.DUPLICATE_KEY) {
                throw error;
            }
            const bulk = collection.initializeUnorderedBulkOp({ checkKeys: false });
            const errors = error.writeErrors || [error]; // if only one error
            for (const { err } of errors) {
                const op = err.op;
                if (uniqueField !== '_id') {
                    delete op._id;
                }
                const uniqueValue = op[uniqueField];
                bulk.find({ [uniqueField]: uniqueValue }).upsert().replaceOne(op);
                replaced.add(uniqueValue);
                inserted.delete(uniqueValue);
            }
            try {
                errors.length && await bulk.execute();
            } catch (error) {
                throw error;
            }
        }
        return {
            count: documents.length,
            insertedCount: inserted.size,
            replacedCount: replaced.size,
            insertedKeys: [...inserted.values()],
            replacedKeys: [...replaced.values()],
            insertedDocuments,
        };
    }
    /**
     * Find documents from a given collection
     * @param {Collection} name collection name
     * @param {any|any[]} aggr
     * @param {Object} [opt]
     * @param {number} [opt.limit]
     * @param {Object} [opt.sort]
     * @param {Object} [opt.project]
     * @param {boolean} [opt.allowDiskUse]
     * @returns {Promise<any>}
     */
    async findOne(name, aggr = {}, opt = {}) {
        opt = {
            limit: 1,
            ...opt
        };
        const cursor = await this.find(name, aggr, opt);
        return await cursor.hasNext() && await cursor.next() || null;
    }
    // todo: replace all usage with findAll()
    /**
     * Execute query/aggregation, return cursor
     * @param {(string|string[])} name collection name
     * @param {any|any[]} aggr
     * @param {Object} [opt]
     * @param {number} [opt.limit]
     * @param {Object} [opt.sort]
     * @param {Object} [opt.project]
     * @param {Object} [opt.cursor]
     * @param {boolean} [opt.allowDiskUse]
     */
    async find(name, aggr = {}, opt: any = {}) {
        opt = {
            allowDiskUse: true,
            ...opt
        };
        const collection = await this.collection(name);
        if (Array.isArray(aggr)) {
            return await collection.aggregate(aggr, opt);
        }
        let cursor = collection.find(aggr, opt.cursor);
        if (opt.sort) {
            cursor = cursor.sort(opt.sort);
        }
        if (opt.project) {
            const project = {
                _id: null,
                ...opt.project
            };
            cursor = cursor.project(project);
        }
        if (opt.limit) {
            cursor = cursor.limit(opt.limit);
        }
        return cursor;
    }
    /**
     * Find documents from a given collection
     * @param {CollectionName} name collection name
     * @param {any|any[]} aggr
     * @param {Object} [opt]
     * @param {number} [opt.limit]
     * @param {Object} [opt.sort]
     * @param {Object} [opt.project]
     * @param {boolean} [opt.allowDiskUse]
     * @returns {Promise<any[]>}
     */
    async findAll(name, aggr = {}, opt = {}) {
        const cursor = await this.find(name, aggr, opt);
        return await cursor.toArray();
    }

    /**
     *
     * @param {string} name collection name
     * @param {any|any[]} ids
     */
    async getById(name, ids) {
        if (ids == null) {
            throw new Error(`expected non-empty id`);
        }
        const collection = await this.collection(name);
        if (Array.isArray(ids)) {
            return await collection.find({ _id: { $in: ids } }).toArray();
        }
        return await collection.find({ _id: ids }).next();
    }
    /**
     * Count documents with optional filter
     * @param {string} name collection name
     * @param {Object} [filter]
     * @returns {Promise<number>}
     */
    async count(name, filter = {}) {
        const collection = await this.collection(name);
        const pipe = Array.isArray(filter) && filter || [{ $match: filter }];
        const aggr = [
            ...pipe,
            { $count: 'count' }
        ];
        const res = await collection.aggregate(aggr, { allowDiskUse: true }).toArray();
        return (res[0] || {}).count || 0;
    }
    async min(name, fieldName, filter = {}) {
        const collection = await this.collection(name);
        const aggr = [
            { $sort: { [fieldName]: 1 } },
            { $match: filter },
            { $limit: 1 }
        ];
        const res = await collection.aggregate(aggr, { allowDiskUse: true }).toArray();
        return res[0];
    }
    async max(name, fieldName, filter = {}) {
        const collection = await this.collection(name);
        const aggr = [
            { $sort: { [fieldName]: -1 } },
            { $match: filter },
            { $limit: 1 }
        ];
        const res = await collection.aggregate(aggr, { allowDiskUse: true }).toArray();
        return res[0];
    }
    /**
     * Return distinct values for the specified field expression
     * @param {string} name collection name
     * @param {string} fieldName field expression
     * @param {Object} [filter]
     * @returns {Promise<any[]>}
     */
    async distinct(name, fieldName, filter = {}) {
        fieldName = typeof fieldName === 'string' && fieldName[0] !== '$' && `$${fieldName}` || fieldName;
        const collection = await this.collection(name);
        const aggr = [
            { $match: filter },
            { $group: { _id: fieldName } },
        ];
        const res = await collection.aggregate(aggr, { allowDiskUse: true }).toArray();
        return res.map(x => x._id);
    }
    /**
     * Drop collection
     * @param {(string|string[])} name collection name
     */
    async drop(name) {
        const collection = await this.collection(name);
        try {
            return await collection.drop();
        } catch (error) {
            if (error.codeName === 'NamespaceNotFound') {
                return null;
            }
            throw error;
        }
    }
    /**
     * Delete all documents
     * @param {(string|string[])} name collection name
     */
    async truncate(name) {
        try {
            let indexes = [];
            const collection = await this.collection(name);
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
        } catch (error) {
            if (error.codeName === 'NamespaceNotFound') {
                return await this.collection(name);
            }
            throw error;
        }
    }
    /**
     * Check if collection exists
     * @param {(string|string[])} name collection
     */
    async collectionExists(name) {
        try {
            const collection = await this.collection(name);
            await collection.stats();
            await collection.indexes();
            return true;
        } catch (err) {
            console.log(err);
            if (err.codeName === 'NamespaceNotFound' || err.errmsg && err.errmsg.indexOf('not found')) {
                return false;
            }
            throw err;
        }
    }

    async iterateCursor(cursor, func, opt: any = {}) {
        let hasNext = await cursor.hasNext();
        let i = 0;
        while (hasNext) {
            i++;
            const item = await cursor.next();
            hasNext = await cursor.hasNext() && (!opt.limit || i < opt.limit);
            await func(item);
        }
        return { count: i };
    }
    async iterateBatch(cursor, func, opt: any = {}) {
        const batchSize = opt.batchSize || 200;
        let batch = [], i = 0;
        while (await cursor.hasNext()) {
            i++;
            const item = await cursor.next();
            batch.push(item);
            if (batch.length >= batchSize) {
                await func(batch);
                batch = [];
            }
        }
        if (batch.length > 0) {
            await func(batch);
        }
        return { count: i };
    }
    async exportCursor(cursor, targetCollection, opt: any = {}) {
        const upsert = async batch => await this.upsert(targetCollection, batch, opt.uniqueField);
        return await this.iterateBatch(cursor, upsert, opt);
    }
    /**
     * @param {string} [name] database name
     * @returns {Promise<{ name: string, type: string, options: object, info: {readOnly: boolean}}[]>}
     */
    async listCollections(name = this._dbName) {
        const db = await this.db(name);
        return await db.listCollections().toArray();
    }
    /**
     * @returns {Promise<{databases: { name: string, sizeOnDisk: number, empty: boolean}[], totalSize: number, ok: number}>}
     */
    async listDbs() {
        const db = await this.db();
        return await db.admin().listDatabases();
    }

    async createIndex(
        collectionName: CollectionName,
        fieldName: string | string[],
        opt?: IndexOptions
    ) {
        if (Array.isArray(fieldName)) {
            for (const field of fieldName) {
                await this.createIndex(collectionName, field, opt);
            }
            return;
        }
        const collection = await this.collection(collectionName);
        opt = {
            background: true,
            unique: false,
            name: `${collection.collectionName}_${fieldName}`,
            // partialFilterExpression: { [fieldName]: { $ne: null } },
            ...opt
        };
        return await collection.createIndex({ [fieldName]: 1 }, opt);
    }
    /**
     * @param {(string|string[])} sourceCollection
     * @param {(string|string[])} destinationCollection
     */
    async copyIndexes(sourceCollection, destinationCollection) {
        const dest = await this.collection(destinationCollection);
        const source = await this.collection(sourceCollection);
        const indexes = await source.listIndexes().toArray();
        for (const options of indexes) {
            const key = options.key;
            delete options.key;
            delete options.v;
            delete options.ns;
            options.name = `${dest.collectionName}_${Object.keys(key).join('_')}`;
            await dest.createIndex(key, options);
        }
        return await dest.listIndexes().toArray();
    }
    /**
     * @param {(string|string[])} sourceCollection
     * @param {(string|string[])} destinationCollection
     * @param {object} [opt]
     * @param {boolean} [opt.copyIndexes] default false
     * @param {boolean} [opt.dropIfExists] default false
     */
    async copyCollection(sourceCollection, destinationCollection, opt: any = {}) {
        opt.dropIfExists && await this.drop(destinationCollection);
        const dest = await this.collection(destinationCollection);
        const source = await this.collection(sourceCollection);
        const cursor = source.find();
        await this.iterateBatch(cursor, async batch => await dest.insertMany(batch));
        opt.copyIndexes && await this.copyIndexes(sourceCollection, destinationCollection);
        return dest;
    }
    async transformCollection(collectionName, func, opt: any = {}) {
        const collection = await this.collection(collectionName);
        let cursor = collection.find(opt.filter || {});
        opt.sort && (cursor = cursor.sort(opt.sort));
        const transformBatch = async batch => {
            const bulk = collection.initializeUnorderedBulkOp({ checkKeys: false });
            for (const item of batch) {
                await func(item);
                bulk.find({ _id: item._id }).upsert().replaceOne(item);
            }
            await bulk.execute();
        };
        return await this.iterateBatch(cursor, transformBatch, opt);
    }
    /**
     *
     * @param {(string|string[])} collectionName
     */
    async getIndexes(collectionName) {
        const collection = await this.collection(collectionName);
        return await collection.listIndexes().toArray();
    }
    /**
     * @returns {Promise<Object.<string,string[]>>}
     */
    async listAllCollections() {
        /** @type {Object.<string,string[]>} */
        const result = {};
        const dbs = await this.listDbs();
        for (const { name } of dbs.databases) {
            result[name] = (await this.listCollections(name)).map(x => x.name).sort();
        }
        return result;
    }
}

export const mongo = MongoStorage.instance();
export const disconnect = MongoStorage.disconnect;

module.parent == null && main().catch(console.error).then(() => MongoStorage.disconnect());
async function main() {
    const storage = await MongoStorage.instance();
    const collections = await storage.listAllCollections();
    console.log(JSON.stringify(collections, null, 2));
    await storage.disconnect();
}
