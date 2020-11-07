// process.env.MONGO_CONNECTION_STRING = 'mongodb://devbox';
process.env.MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost';
const { consolidateAssets } = require('../../playground/src/troubleshoot/consolidate-assets');

const commander = require('commander');
commander
    .version('0.1.0')
    .description('consolidate tsutil data')
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

    await consolidateAssets();
}


function scheduleExit() {
    setTimeout(() => {
        process.exit(0);
    }, 1000);
}
