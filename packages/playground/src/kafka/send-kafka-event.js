require('packages/demo-http-server/src/node_modules/@tsutil/dotenv');
const { KafkaSender } = require('@tsutil/kafka');
const { kafka } = require('@tsutil/inventory');
const { uid } = require('@tsutil/utils');

const { topics } = kafka;
const kafkaSender = KafkaSender.instance();

module.parent == null && main().catch(console.error);
async function main() {
    console.log(process.env.KAFKA_BROKERS);
    const change = {
        uid: uid.create({ type: '0a' }),
        store_id: 1,
        sku_variant_code: 'GRB18P1783V2984',
        grover_api_availability: 'available',
        old_grover_api_availability: null,
        availability_mode: 'automatic',
        available_count: 26,
        old_availability_mode: null,
        old_available_count: null,
        created_at: new Date().toISOString(),
        published_at: null,
    };
    await kafkaSender.sendJson(topics.tsutil.availability, change);
}
