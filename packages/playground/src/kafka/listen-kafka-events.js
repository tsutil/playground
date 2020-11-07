require('packages/demo-http-server/src/node_modules/@tsutil/dotenv');
const { KafkaConsumer, IncomingMessage } = require('@tsutil/kafka');
const { kafka } = require('@tsutil/inventory');
const { dump } = require('@tsutil/utils');

const { topics } = kafka;
process.env.KAFKA_CONSUMER_GROUP_ID = 'tsutil-debug';
process.env.KAFKA_BROKERS = 'kafka1.test:9092;kafka2.test:9092;kafka3.test:9092';
process.env.KAFKA_DISABLED = 'false';

const TOPIC_NAME = topics.tsutil.entityChange;
const consumer = KafkaConsumer.instance();

module.parent == null && main().catch(console.error);
async function main() {
    await consumer.subscribeToTopics([
        {
            topic: TOPIC_NAME,
            process: onEvent,
        },
    ]);
}
/**
 *
 * @param {IncomingMessage} msg
 */
async function onEvent(msg) {
    await dump.json(msg, TOPIC_NAME, `event-${msg.timestamp}.json`);
}

