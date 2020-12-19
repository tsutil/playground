import 'tsconfig-paths/register';
import '@tsutil/dotenv';
import { sleep, timeout } from '@tsutil/utils';
import { createLogger } from '@tsutil/logger';

const logger = createLogger('examples');

module.parent == null && main().catch(console.error);
async function main() {
    await success('job1');
    await failure('job2');
}

async function success(name: string){
    const res = await timeout.seconds(1, () => demoJob(750, name), 'should succeed in time');
    logger.info(`success: ${res}`);
}

async function failure(name: string){
    try {
        await timeout.milliseconds(750, () => demoJob(1000, name), 'job took too much time');
        logger.error(`this should never happen`);
    } catch (err) {
        logger.info(`timeout: ${err.message}`);
    }
}

async function demoJob(durationMs: number, name: string) {
    logger.info(`${name}: started`);
    await sleep.milliseconds(durationMs);
    logger.info(`${name}: finished`);
    return 'done';
}
