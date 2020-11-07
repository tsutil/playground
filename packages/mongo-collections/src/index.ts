export const collections = {
    logs: {
        tsutil:                  ['logs-production', 'tsutil'],
        NODE_OPS:              ['logs-production', 'node_ops'],
    },
    tsutil: {
        ASSET:                      ['tsutil', 'asset'],
        CUSOMER_ASSET_ALLOCATION:   ['tsutil', 'customer_asset_allocation'],
        GROVER_API_AVAILABILITY:    ['tsutil', 'grover_api_availability'],
        GROVER_API_VARIANTS:    ['tsutil', 'grover_api_variants'],
        GROVER_API_ORDER:           ['tsutil', 'grover_api_order'],
        GROVER_API_PRODUCT:         ['tsutil', 'grover_api_product'],
        GROVER_API_STORE:           ['tsutil', 'grover_api_store'],
        ORDER:                      ['tsutil', 'order'],
        RESERVATION:                ['tsutil', 'reservation'],
        RESERVATION_HISTORY:        ['tsutil', 'reservation_history'],
        REPLICATION_CURSOR:         ['tsutil', 'replication_cursor'],
        REPLICATION_CONFIG:         ['tsutil', 'replication_config'],
        RULE:                       ['tsutil', 'rule'],
        STORE_VARIANT_AVAILABILITY: ['tsutil', 'store_variant_availability'],
        STORE_VARIANT_AVAILABILITY_CONSOLIDATION: ['tsutil', 'store_variant_availability_consolidation'],
        STOCK_VARIANT_AVAILABILITY: ['tsutil', 'stock_variant_availability'],
        STORE_VARIANT_AVAILABILITY_CHANGE: ['tsutil', 'store_variant_availability_change'],
        STOCK:                      ['tsutil', 'stock'],
        STORE:                      ['tsutil', 'store'],
        STORE_STOCK_LINK:           ['tsutil', 'store_stock_link'],
        TROUBLESHOOT_AVAILABILITY:  ['tsutil-diag', 'troubleshoot_availability'],
        view: {
            ALLOCATION_QUEUE:       ['tsutil', 'view.allocation_queue'],
            PROCUREMENT_QUEUE_MIX:  ['tsutil', 'view.procurement_queue_mix'],
        }
    },
    kafka: {
        ORDER:                 ['kafka-production', 'order_events'],
        tsutil: {
            ENTITY_CHANGE:     ['kafka-production', 'tsutil.entity_change']
        },
        sf: {
            ASSET:             ['kafka-production', 'db.salesforce.asset'],
        },
        shipcloud: {
            INCOMING_NOTIFICATION: ['kafka-production', 'shipping.shipcloud.incoming_notification'],
        },
        wemalo: {
            REGISTER_RETURN_BOOKING: ['kafka-production', 'wms.wemalo.register_return_booking'],
            REGISTER_REFURBISHMENT:  ['kafka-production', 'wms.wemalo.register_refurbishment'],
        },
    },
    sf: {
        ACCOUNT:               ['grover', 'sf.account'],
        ASSET:                 ['grover', 'sf.asset'],
        DELETED_PAYMENT:       ['grover', 'sf.deleted_payment'],
        CONTACT:               ['grover', 'sf.contact'],
        ORDER:                 ['grover', 'sf.order'],
        ORDER_ITEM:            ['grover', 'sf.order_item'],
        PRICEBOOK_ENTRY:       ['grover', 'sf.pricebook_entry'],
        PRODUCT:               ['grover', 'sf.product'],
        TASK:                  ['grover', 'sf.task'],
        ASSET_PAYMENT:         ['grover', 'sf.asset_payment'],
        ASSET_ALLOCATION:      ['grover', 'sf.asset_allocation'],
        ASSET_INSURANCE:       ['grover', 'sf.asset_insurance'],
        EXCHANGE_RATE:         ['grover', 'sf.exchange_rate'],
        PURCHASE_REQUEST:      ['grover', 'sf.purchase_request'],
        REFUND_PAYMENT:        ['grover', 'sf.refund_payment'],
        STORE:                 ['grover', 'sf.store'],
        SUBSCRIPTION:          ['grover', 'sf.subscription'],
        SUBSCRIPTION_PAYMENT:  ['grover', 'sf.subscription_payment'],
        SUPPLIER:              ['grover', 'sf.supplier'],
        CAPITAL_SOURCE:        ['grover', 'sf.capital_source'],
        view: {
            RECENTLY_PURCHASED:        ['grover', 'sf.view.recently_purchased'],
            PENDING_ALLOCATION:        ['grover', 'sf.view.pending_allocation'],
            PENDING_ALLOCATION_DAILY:  ['grover', 'sf.view.pending_allocation_daily'],
        }
    },
    tools: {
        SF_EXPORT_RESULT:      ['grover-tools', 'sf-export-result'],
    },
    // (populated from logs manually)
    wemalo: {
        ASSET_REFURBISHMENTS:  ['grover', 'wemalo.asset_refurbishments'],
        REFURBISHMENTS:        ['grover', 'wemalo.refurbishments'],
        RETURN_BOOKINGS:       ['grover', 'wemalo.return_bookings'],
        RETURN_BOOKINGS_FULL:  ['grover', 'wemalo.return_bookings_full'],
        WEBHOOK_INVOCATIONS:   ['grover', 'wemalo.webhook_invocations'],
        view: {
            RETURN_BOOKINGS:   ['grover', 'wemalo.view.return_bookings'],
        },
    },
};
export const indexes = [
    [collections.logs.tsutil, ['level', 'prefix', 'date']],
    [collections.logs.NODE_OPS, ['level', 'prefix', 'date']],

    [collections.tsutil.ASSET, ['skuVariantCode', 'stockUid', 'salesforceId', 'serialNumber', 'updatedAt']],
    [collections.tsutil.ORDER, ['storeId', 'orderNumber']],
    [collections.tsutil.RESERVATION, ['skuVariantCode', 'orderNumber']],
    [collections.tsutil.RESERVATION_HISTORY, ['skuVariantCode', 'orderNumber', 'updatedAt']],
    [collections.tsutil.STORE, ['id']],
    [collections.tsutil.STORE_VARIANT_AVAILABILITY, ['storeId', 'storeUid', 'skuVariantCode', 'updatedAt']],
    [collections.tsutil.GROVER_API_AVAILABILITY, ['store_id', 'sku', 'updated_at']],
    [collections.tsutil.GROVER_API_VARIANTS, [ 'sku', 'id', 'updated_at']],
    [collections.tsutil.GROVER_API_ORDER, ['number', 'updated_at']],
    [collections.tsutil.GROVER_API_PRODUCT, ['sku']],

    // kafka
    [collections.kafka.sf.ASSET, ['date', 'entityId']],

    // salesforce
    [collections.sf.ASSET, ['CreatedDate', 'asset_allocation__c', 'Product2Id', 'SerialNumber', 'f_product_sku_variant__c', 'supplier__c']],
    [collections.sf.ASSET_ALLOCATION, ['status__c', 'asset__c', 'subscription__c', 'order__c', 'order_product__c', 'shipcloud_shipment_id__c', 'customer__c', 'customer_email__c', 'wh_goods_order_id__c']],
    [collections.sf.ASSET_INSURANCE, ['allocation__c', 'asset__c', 'end__c']],
    [collections.sf.ORDER, ['spree_order_number__c', 'customer_email__c']],
    [collections.sf.ORDER_ITEM, ['OrderId', 'product_id__c']],
    [collections.sf.SUBSCRIPTION, ['customer__c', 'spree_order_number__c', 'order__c', 'order_product__c']],
    [collections.sf.SUBSCRIPTION_PAYMENT, ['subscription__c', 'asset__c', 'number__c', 'date_due__c', 'status__c', 'IsDeleted']],
    [collections.sf.REFUND_PAYMENT, ['subscription_payment__c', 'asset_payment__c', 'subscription__c', 'allocation__c']],

    // wemalo
    [collections.wemalo.REFURBISHMENTS, ['date', 'serialNumber']],
    [collections.wemalo.RETURN_BOOKINGS, ['event_date', 'serial_number']],
    [collections.wemalo.ASSET_REFURBISHMENTS, ['event_date', 'serial_number']],
];
