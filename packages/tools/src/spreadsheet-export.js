const { service } = require('@tsutil/replication');
const { asNumber } = require('@tsutil/utils');

const commander = require('commander');
commander
    .version('0.1.1')
    .description('export mongo data to google spreadsheets')
    .option('-c, --connectionString <conStr>', 'mongodb connection string', 'mongodb://localhost')
    .option('-l, --limit <number>', 'max number of objects to export', '50000')
;

module.parent == null && main().catch(console.error);
async function main() {
    commander.parse(process.argv);

    const opt = commander.opts();
    console.log(opt);
    try {
        await run(opt);
    } catch (error) {
        console.log(`error during export`);
        console.error(error);
        process.exit(1);
    }

    process.on('SIGTERM', scheduleExit);
    process.on('SIGINT', scheduleExit);
}

async function run(opt) {
    await service.spreadsheetExport.runAll({
        limit: asNumber(opt.limit)
    });
}

function scheduleExit() {
    setTimeout(() => {
        process.exit(0);
    }, 3000);
}
