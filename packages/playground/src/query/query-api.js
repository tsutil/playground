/* eslint-disable quotes */
// dev.env: API_BASE_PATH="https://tsutil-api-staging.grover.com/api"
require('module-alias/register');
require('packages/playground/src/kafka/node_modules/@tsutil/dotenv');
const { client, FindStoreAvailabilityAvailabilityModeEnum, AvailabilityMode, AssetStatus } = require('@tsutil/api-client');
const { dump } = require('packages/playground/src/kafka/node_modules/@tsutil/utils');

module.parent == null && main().catch(console.error);
async function main() {
    console.log(`using api ${process.env.API_BASE_PATH}`);
    const sku = 'GRB224P10123V20785';
    await toggleAvailability(sku, 126);
}

async function toggleAvailability(skuVariantCode, storeId = 1) {
    await client.upsertStoreVariant({
        storeId: storeId,
        skuVariantCode: skuVariantCode,
        availabilityMode: AvailabilityMode.WaitingList,
    });
    await client.upsertStoreVariant({
        storeId: storeId,
        skuVariantCode: skuVariantCode,
        availabilityMode: AvailabilityMode.Automatic,
    });
}
