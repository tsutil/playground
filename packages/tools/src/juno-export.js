// process.env.MONGO_CONNECTION_STRING = 'mongodb://devbox';
const { service } = require('@tsutil/replication');

const commander = require('commander');
commander
    .version('0.2.2')
    .description('export tsutil api objects to mongo')
    .option('-u, --baseUrl <url>', 'api base url', 'http://localhost:8005')
    .option('-t, --typeName <name>', 'model type name')
    .option('-p, --pathName <path>', 'api model path')
    .option('-c, --connectionString <conStr>', 'mongodb connection string')
    .option('-l, --limit <number>', 'max number of objects to export', '100000')
    .option('-b, --batchSize <number>', 'number of objects in one request', '100')
    .option('--trackHistory <boolean>', 'keep all changes in separate collection', 'true')
;

module.parent == null && main().catch(console.error);
async function main() {
    let exitCode = 1;
    try {
        exitCode = await run();
    } catch (error) {
        console.log(`error during export`);
        console.error(error);
    }
    process.exit(exitCode);
}

async function run() {
    commander.parse(process.argv);

    const opt = commander.opts();
    console.log(opt);

    process.on('SIGTERM', scheduleExit);
    process.on('SIGINT', scheduleExit);

    if (!opt.pathName) {
        console.log(`exporting all items`);
        await service.apiExport.exportAll();
    } else {
        await exportOne(opt);
    }
}

async function exportOne(opt) {
    const typeName = opt.typeName;
    const pathname = opt.pathName;

    const exportOpt = {
        typeName,
        baseUrl: opt.baseUrl || process.env.BASE_URI,
        mongo: {
            connectionString: opt.connectionString
                || process.env.MONGO_CONNECTION_STRING
                || 'mongodb://localhost'
        },
        trackHistory: opt.trackHistory == 'true',
        pathname,
        limit: opt.limit && Number(opt.limit),
        batchSize: opt.batchSize && Number(opt.batchSize),
    };
    await service.apiExport.exportObjects(exportOpt);
}

function scheduleExit() {
    setTimeout(() => {
        process.exit(0);
    }, 3000);
}
