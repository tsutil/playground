process.env.MONGO_CONNECTION_STRING = 'mongodb://devbox';
require('module-alias/register');
const { service } = require('@tsutil/replication');

const defaultExportConfig = {
    disabled: false,
    trackHistory: true,
    typeName: null,
    pathname: null,
    limit: 2000,
    batchSize: 100,
    baseUrl: 'https://tsutil-api.grover.com',
    // baseUrl: 'https://tsutil-api-staging.grover.com',
    query: { sort: 'updatedAt:asc' },
    historyMaxSizeMb: 1000,
};

module.parent == null && main().catch(console.error);
async function main() {
    try {
        await updateConfigs();
        // await service.apiExport.exportAll();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

async function demoExportOne(){
    await service.apiExport.exportObjects({
        // baseUrl: 'https://tsutil-api.grover.com',
        baseUrl: 'https://tsutil-api-staging.grover.com',
        typeName: 'order_attempt',
        pathname: '/api/order',
        query: { sort: 'createdAt:asc' },
    });
}

async function updateConfigs() {
    const configs = [
        {
            typeName: 'store_variant_availability',
            pathname: '/api/availability/store',
        },
        {
            typeName: 'stock_variant_availability',
            pathname: '/api/availability/stock',
        },
        {
            typeName: 'order',
            pathname: '/api/order',
            query: { sort: 'createdAt:asc' },
        },
        {
            typeName: 'asset',
            pathname: '/api/asset',
        },
        {
            typeName: 'reservation',
            pathname: '/api/reservation',
        },
        {
            typeName: 'store',
            pathname: '/api/store',
        },
        {
            typeName: 'rule',
            pathname: '/api/rule',
        },
        {
            typeName: 'sku',
            pathname: '/api/sku',
        },
        {
            typeName: 'store_stock_link',
            pathname: '/api/store/stock-link',
        },
    ].map(x => ({ ...defaultExportConfig, ...x }));

    await service.apiExport.upsertExportConfiguration(configs);
}
