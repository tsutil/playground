// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
import 'tsconfig-paths/register';
import fs from 'fs';
import { sleep } from '@tsutil/utils';
import { createLogger } from '@tsutil/logger';

const logger = createLogger('examples');
const data = new Array(5).fill(0).map((_, i) => `item${i}`);

/**
 * Iterator is an object which defines a sequence
 * and potentially a return value upon its termination.
 */
function createDataIterator() {
    let i = 0;
    return {
        next: function () {
            const done = i + 1 > data.length;
            const value = data[i++];
            return { value, done };
        }
    };
}

/**
 * Generators compute their yielded values on demand.
 * Example: fs.createReadStream(__filename, { encoding: 'utf-8' })
 */
async function* dataAsyncGenerator(sleepMs = 100) {
    for (const item of data) {
        await sleep.milliseconds(sleepMs);
        yield item;
    }
}

module.parent == null && main().catch(console.error);
async function main() {
    const iterator = createDataIterator();
    let result = iterator.next();
    while (!result.done) {
        logger.info(`using iterator: ${result.value}`);
        result = iterator.next();
    }

    for await(const item of dataAsyncGenerator()){
        logger.info(`using async generator: ${item}`);
    }
}


