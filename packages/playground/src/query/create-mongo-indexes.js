require('module-alias/register');
const { dump } = require('packages/playground/src/kafka/node_modules/@tsutil/utils');
const { MongoStorage } = require('@tsutil/mongo');
const { indexes } = require('@tsutil/mongo-collections');

// const mongo = MongoStorage.instance('mongodb://devbox');
const mongo = new MongoStorage({ connectionString: 'mongodb://devbox' });

module.parent == null && main().catch(console.error)
    .then(() => mongo.disconnect())
    .then(() => process.exit());

async function main() {
    for(const [col, idx] of indexes){
        await mongo.createIndex(col, idx);
    }
}
