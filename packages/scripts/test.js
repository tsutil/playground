require('module-alias/register');
const path = require('path');
const reporter = require('tap-spec');
const childProcess = require('child_process');
const searchFiles = require('tiny-glob');
const { dump } = require('@tsutil/utils');

const ROOT_DIR = path.join(__dirname, '../../..');
const NODE_ARGS = ['-r', 'module-alias/register'];

module.parent == null && main().catch(console.error);
async function main() {
    let [glob] = process.argv.slice(2);

    glob = glob || 'dist/**/*.test.js';
    const files = await searchFiles(glob, { absolute: true, cwd: ROOT_DIR });

    const childResults = [];
    const childData = [];
    const onData = (data, file) => {
        childData.push({ file, data: data.toString() });
        tapReporter.write(data);
    };
    const tapReporter = reporter();
    tapReporter.pipe(process.stdout);

    for (const file of files) {
        const res = await runTestFile(file, { onData });
        childResults.push(res);
    }
    await printResults(childResults, childData);
}
/**
 * @param {string} file
 * @param {object} [opt]
 * @param {(any, string) => void} [opt.onData]
 */
async function runTestFile(file, opt = {}) {
    return new Promise((resolve, reject) => {
        const child = childProcess.spawn('node', [
            ...NODE_ARGS,
            file
        ], {
            env: {
                CONSOLE_LOG_LEVEL: 'warn',
                ...process.env,
            }
        });
        opt.onData && child.stdout.on('data', data => opt.onData(data, file));
        child.stdout.on('error', err => { // todo: check failing tests
            console.error(`child error`);
            console.error(err);
        });
        child.on('close', (code) => resolve({ file, code }));
    });
}
async function printResults(childResults, childData) {
    console.log(`\n`);
    const successfulTests = childData.filter(x => x.data.startsWith('ok '));
    const failedTests = childData.filter(x => x.data.startsWith('fail '));
    const failedChildren = childResults.filter(x => x.code != 0);
    if (failedTests.length) {
        console.log('\x1b[31m%s\x1b[0m %s', `Tests failed`, `${failedTests.length} out of ${successfulTests.length}`);
        console.log(failedChildren.map(x => x.file.replace(ROOT_DIR, '.')));
        console.log(`\n`);
        await dump.json(failedTests, 'test-results.json');
        process.exit(1);
    } else if (failedChildren.length) {
        console.log('\x1b[31m%s\x1b[0m %s', `Tests failed`, `${failedChildren.length} out of ${successfulTests.length}`);
        console.log(failedChildren.map(x => x.file.replace(ROOT_DIR, '.')));
        console.log(`\n`);
        await dump.json(failedChildren, 'test-results.json');
        process.exit(1);
    } else if (childData.length == 0) {
        console.log('\x1b[33m%s\x1b[0m', `No tests found`);
    } else {
        const count = successfulTests.length;
        console.log('\x1b[32m%s\x1b[0m %s', `Tests succeeded`, `${count} out of ${count}`);
    }
    console.log(`\n`);
}
