require('module-alias/register');
require('packages/playground/src/kafka/node_modules/@tsutil/dotenv');
const { spreadSheetConfig } = require('@tsutil/replication');
const { spreadsheets, SpreadsheetStorage } = require('@tsutil/spreadsheets');
const { dump, random } = require('packages/playground/src/kafka/node_modules/@tsutil/utils');
const { MongoStorage } = require('@tsutil/mongo');
const { collections } = require('@tsutil/mongo-collections');

const mongo = new MongoStorage('mongodb://devbox');
const docId = '1iJhZ8U5ifM18HWhcQ4Kr_rJpjk6FWN-S-MH3bVnWM6E'; // test document
module.parent == null && main().catch(console.error).then(() => mongo.disconnect());

async function main() {
    await demoWrite();
    // await exportStoreVariant();
}
async function demoWrite() {
    const auth = spreadSheetConfig.getCredentials();
    const storage = new SpreadsheetStorage({ docId, auth });
    const worksheets = await storage.worksheets();
    const [worksheet] = worksheets;

    let row = await storage.upsert('playground_store_availability', {
        values: {
            SKU: 'GRB18P1721V2911',
            AvailableCount: 10,
            CreatedAt: '2020-04-28T02:16:54.852Z'
        },
    });
    console.log(row);

    row = await storage.upsert('playground_store_availability', {
        rowNumber: 3,
        values: {
            AvailableCount: 4,
        },
    });
}
