require('module-alias/register');
const fs = require('fs-extra');
const path = require('path');
const { dump } = require('packages/playground/src/kafka/node_modules/@tsutil/utils');
const { MongoStorage, lib, ag } = require('@tsutil/mongo');
const { collections } = require('@tsutil/mongo-collections');
// const mongo = new MongoStorage('mongodb://localhost');
const mongo = new MongoStorage('mongodb://devbox.production');

module.parent == null && main().catch(console.error).then(() => mongo.disconnect());
async function main() {
    // await queryEntityChanges();
    // await queryOrders();
    // await upsertApiExportConfig();
    // await storeStocks();
    // await allocationQueue();

    // await query();
    await findDoubleAllocations();
}

async function query(){
    const aggr = [
        { $match: {
            skuVariantCode: 'GRB111P3941V5762',
            status: 'in_stock',
        }},
        ...ag.join(collections.tsutil.STOCK, 'stockUid', 'uid', 'stock'),
        { $sortByCount: '$stock.name' },
    ];
    const res = await mongo.findAll(collections.tsutil.ASSET, aggr);
    res.forEach(x => console.log(`${x._id}: ${x.count}`));
    await dump.json(res, 'mongo-query-result.json');
}

async function findDoubleAllocations(){
    let ignoreStatuses = ['RETURNED', 'CANCELLED', 'TO BE REPLACED', 'TO BE FIXED', 'SOLD', 'FAILED DELIVERY' ];

    const aggr = [
        { $match: {
            LastModifiedDate: { $gt: '2020-10-01' },
            status__c: { $nin: ['RETURNED', 'CANCELLED', 'TO BE REPLACED', 'IN TRANSIT', 'TO BE FIXED', 'SOLD', 'FAILED DELIVERY' ] }}},
        { $sort: { CreatedDate: -1 }},
        { $group: {
            _id: {
                subscriptionId: '$subscription__c',
                skuVariantCode: '$asset_sku_variant__c',
            },
            ids: { $push: '$Id' },
            count: { $sum: 1 },
            statuses: { $push: '$status__c' },
            maxCreatedAt: { $max: '$CreatedDate' },
            createdAt: { $push: '$CreatedDate' },
        }},
        { $project: {

        }},
        { $sort: { maxCreated: -1 }},
        { $match: { $expr: { $and: [
            { $gt: ['$count', 1] },
        ]}}},
    ];
    const res = await mongo.findAll(collections.sf.ASSET_ALLOCATION, aggr);
    await dump.json(res, 'mongo-query-result.json');
    // ).map(x => '[' + x.statuses[0] + '/' + x.statuses[1] + '] ' + 'https://getgrover.lightning.force.com/lightning/r/subscription__c/' + x._id + '/view');
}

async function findDuplicateOrders(){
    const aggr = [
        { $match: {
            success: true,
            orderMode: { $ne: 'mix' },
        }},
        { $sort: { createdDate: 1 }},
        { $group: {
            _id: {
                orderNumber: '$orderNumber',
            },
            count: { $sum: 1 },
            dates: { $push: '$createdAt' },
            firstDate: { $first: '$createdAt' },
            lastDate: { $last: '$createdAt' },
        }},
        { $match: {
            count: { $gt: 1 },
        }},
        { $addFields: {
            intervalDays: { $divide: [{ $subtract: ['$lastDate', '$firstDate'] }, 24*60*60*1000]},
        }},
        { $match: {
            intervalDays: { $gt: 10 },
        }},
        // { $count: 'count' },
        { $sort: { lastDate: -1 }},
        // { $sort: { intervalDays: -1 }},
        // { $sortByCount: '$storeId'}
        { $limit: 100 },
    ];
    const res = await mongo.findAll(collections.tsutil.ORDER, aggr);
    await dump.json(res, 'mongo-query-result.json');
}

async function upsertApiExportConfig(opt = {}){
    typeName = opt.typeName || 'rule';
    pathname = opt.pathname || '/api/rule';

    const config = {
        typeName,
        pathname,
        disabled: false,
        trackHistory: true,
        limit: 2000,
        batchSize: 100,
        baseUrl: 'https://tsutil-api.grover.com',
        query: {
            sort: 'updatedAt:asc',
        },
        historyMaxSizeMb: 1000,
    };
    const col = await mongo.collection(collections.tsutil.REPLICATION_CONFIG);
    const res = await col.findOneAndUpdate({ typeName, pathname }, { $set: config }, {
        upsert: true,
        returnOriginal: true,
    });
    console.log(`upserted`);
    console.log(res);
}

async function queryOrders() {
    const sku = 'GRB41P3772V5504';
    const aggr = [
        {
            $match: {
                f_product_sku_variant__c: sku,
                CreatedDate: { $gt: '2020-05-01' },
            }
        },
        ...ag.join(collections.sf.ORDER, 'OrderId', 'Id', 'order'),
        {
            $project: {
                orderNumber: '$order.spree_order_number__c',
                status: '$order.Status',
                skuVariantCode: '$f_product_sku_variant__c',
                name: '$product_name__c',
                quantity: '$Quantity',
                isCancelled: { $in: ['$order.Status', ['FAILED FIRST PAYMENT', 'DECLINED', 'CANCELLED']] },
                updatedAt: '$order.LastModifiedDate',
                createdAt: '$order.CreatedDate',
            }
        },
        // { $match: { orderNumber: { $in: orderNumbers }}},
        { $sort: { updatedAt: -1 } },
    ];
    const res = await mongo.findAll(collections.sf.ORDER_ITEM, aggr);
    await dump.json(res, 'mongo-query-result.json');
}
async function queryEntityChanges() {
    const aggr = [
        {
            $match: {
                'value.payload.new.sku_variant_code': 'GRB111P3941V5762',
                'value.payload.type_name': 'stock_variant_availability',
            }
        },
        { $sort: { date: -1 } },
        { $limit: 100 },
    ];
    const res = await mongo.findAll(collections.kafka.tsutil.ENTITY_CHANGE, aggr);
    await dump.json(res, 'mongo-query-result.json');
}

async function allocationQueue(){
    const unsortedStock = await mongo.findOne(collections.tsutil.STOCK, { name: 'Unsorted' });
    const aggr = [
        { $match: {
            status: 'paid',
            quantity: { $gte: 1 },
            stockUid: { $ne: unsortedStock.uid },
        }},
        { $lookup: {
            from: collections.tsutil.ASSET[1],
            let: { stockUid: '$stockUid', skuVariantCode: '$skuVariantCode' },
            pipeline: [
                { $match: { $expr: {
                    $and: [
                        { $eq: ['$status', 'in_stock']},
                        { $eq: ['$stockUid', '$$stockUid']},
                        { $eq: ['$skuVariantCode', '$$skuVariantCode']},
                    ]
                }}},
                { $project: {
                    _id: 0,
                    uid: 1,
                    serialNumber: 1,
                    salesforceId: 1,
                    salesforceStatus: 1,
                    statusUpdatedAt: 1,
                }},
                { $sort: {
                    statusUpdatedAt: 1
                }},
            ],
            as: 'assets',
        }},
        ...ag.join(collections.tsutil.GROVER_API_ORDER, 'orderNumber', 'number', 'groverApiOrderStatus'),
        { $addFields: {
            assets: { $slice: [ '$assets', 3 ] },
            assetsCount: { $size: '$assets' },
            groverApiOrderStatus: '$groverApiOrderStatus.state',
        }},
        { $sort: { priority: -1, statusUpdatedAt: -1 }},
    ];
    // const res = await mongo.findAll(collections.tsutil.RESERVATION, aggr);
    // await dump.json(res, 'mongo-query-result.json');

    const viewName = ['tsutil', 'view.allocation_queue'];
    await lib.createView(await mongo.connect(), viewName, collections.tsutil.RESERVATION, aggr, { dropIfExists: true });
}

async function storeStocks(){
    const aggr = [
        ...ag.lookup(collections.tsutil.STORE_STOCK_LINK, 'uid', 'storeUid', 'link'),
        { $unwind: '$link'},
        ...ag.join(collections.tsutil.STOCK, 'link.stockUid', 'uid', 'stock'),
        // ...ag.lookup(collections.tsutil.RULE, 'stock.uid', 'relatedToUid', 'rules'),
        { $sort: { 'link.priority': -1 }},
        // { $match: { link_count: {$gt: 1}}},
        { $group: {
            _id: '$_id',
            id: { $first: '$id' },
            name: { $first: '$name' },
            stockCount: { $sum: 1 },
            type: { $first: '$type' },
            isPartner: { $first: '$isPartner' },
            updatedAt: { $first: '$updatedAt' },
            createdAt: { $first: '$createdAt' },
            stocks: { $push: {
                link_priority: '$link.priority',
                uid: '$stock.uid',
                name: '$stock.name',
                description: '$stock.description',
                priority: '$stock.priority',
                // rules: '$rules.body',
            }},
        }},
        { $sort: { id: 1 }},
    ];
    // const res = await mongo.findAll(collections.tsutil.STORE, aggr);
    // await dump.json(res, 'mongo-query-result.json');

    const viewName = ['tsutil', 'view.store_stocks'];
    await lib.createView(await mongo.connect(), viewName, collections.tsutil.STORE, aggr, { dropIfExists: true });
}

async function allocationRejects(){
    const aggr = [
        { $match: {
            prefix: 'api/asset/allocate',
            message: { $in: ['Invalid allocation request', 'Asset allocation failed'] },
        }},
        { $project: {
            _id: 0,
            date: '$date',
            message: '$message',
            description: { $cond: [ { $eq: ['$meta.error.message', 'Cannot find a suitable subscription for asset sku expected not to be empty.'] }, 'No pending allocation subscriptions found', '$meta.error.message'] },
            assetId: '$meta.body.assetId',
            orderNumber: '$meta.body.orderNumber',
            error: '$meta.error',
        }},
        { $sort: { date: -1 }},
        // { $limit: 15 },
    ];
    // const res = await mongo.findAll(collections.logs.NODE_OPS, aggr);
    // await dump.json(res, 'mongo-query-result.json');

    const viewName = ['logs-production', 'view.allocation_rejects'];
    await lib.createView(await mongo.connect(), viewName, collections.logs.NODE_OPS, aggr, { dropIfExists: true });
}

async function orderRejectView(){
    const aggr = [
        {$match: {
            // 'reservations.skuVariantCode': 'GRB18P4338V6334',
            createdAt: { $gt: new Date('2020-05-01') },
        }},
        { $addFields : {
            day: { $substr: ['$createdAt', 0, 10] },
            failureFlag: { $cond: [{$eq: ['$success', false]}, 1, 0]},
        }},
        {$group: {
            _id: '$day',
            total: {$sum: 1},
            failed: {$sum: '$failureFlag'},
        }},
        {$addFields: {
            ratio: {$round: [{$divide: ['$failed', '$total']}, 3]}
        }},
        {$project: {
            _id: 0,
            day: '$_id',
            rejected: '$failed',
            attempted: '$total',
            ratio: '$ratio',
            // msg: {$concat: [{$toString: '$_id'}, ': ', {$toString: '$failed'}, ' / ', {$toString: '$total'}, ' (', {$toString: '$ratio'}, ')']},
        }},
        {$sort: {'day': -1}},
    ];
    // const res = await mongo.findAll(collections.tsutil.ORDER, aggr);
    // await dump.json(res, 'mongo-query-result.json');
    const viewName = ['tsutil', 'view.order_reject_daily'];
    await lib.createView(await mongo.connect(), viewName, collections.tsutil.ORDER, aggr, { dropIfExists: true });
}

async function reservationRejectReasonView(){
    const aggr = [
        { $match: {
            createdAt: { $gt: new Date('2020-05-01') },
        }},
        { $addFields : {
            day: { $substr: ['$createdAt', 0, 10] },
        }},
        { $unwind: '$reservations' },
        {$project: {
            day: 1,
            rejectionReason: { $ifNull: [ '$reservations.rejectionReason', 'success' ] }
        }},
        { $group: {
            _id: {
                rejectionReason: '$rejectionReason',
                day: '$day'
            },
            total: {$sum: 1},
            day: {$first: '$day'}

        }},
        { $group: {
            _id: {
                day: '$_id.day',
            },
            reservatonResults: { $push: {
                k: '$_id.rejectionReason',
                v: {$sum: '$total'}
            }},
        }},
        {$project: {
            _id: 0,
            day: '$_id.day',
            reservatonResults: {$arrayToObject: '$reservatonResults'}
        }},
        {$sort: {day: -1}},

    ];
    // const res = await mongo.findAll(collections.tsutil.ORDER, aggr);
    // await dump.json(res, 'mongo-query-result.json');
    const viewName = ['tsutil', 'view.reservation_reject_daily'];
    await lib.createView(await mongo.connect(), viewName, collections.tsutil.ORDER, aggr, { dropIfExists: true });
}
