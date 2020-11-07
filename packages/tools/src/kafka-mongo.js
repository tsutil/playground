const { listenTopics } = require('@tsutil/kafka-mongo');

const commander = require('commander');
commander
    .requiredOption('-t, --topics <topic-names>', '(required) semicolon-separated topics to listen')
    .option('-e, --env <staging|prod[uction]>', '')
    .option('-c, --connectionString <connectionString>', 'mongodb connection string', 'mongodb://localhost');

// accept env variables:
//  KAFKA_CONSUMER_GROUP_ID
//  KAFKA_BROKERS
//  KAFKA_USERNAME
//  KAFKA_PASSWORD

module.parent == null && main().catch(console.error);
async function main() {
    commander.parse(process.argv);

    const opt = commander.opts();
    opt.env = opt.env === 'prod' ? 'production' : opt.env;
    opt.topics = opt.topics.split(';').map(x => x.trim()).filter(x => x);
    opt.connectionString = opt.connectionString || process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost';

    const { topics, env, connectionString } = opt;
    const maxCollectionSizeMb = opt.env?.startsWith('prod') ? 1024 : 100;

    process.on('SIGTERM', scheduleExit);
    process.on('SIGINT', scheduleExit);

    await listenTopics({
        topics,
        connectionString,
        maxCollectionSizeMb,
        env,
    });
}
function scheduleExit() {
    setTimeout(() => {
        process.exit(0);
    }, 3000);
}
