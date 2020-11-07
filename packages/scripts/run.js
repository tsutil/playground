const fs = require('fs-extra');
const path = require('path');
const { fork } = require('child_process');

const SCRIPT_EXTENSION_REGEX = /\.js$/;
const SCRIPT_DIRECTORIES = [
    __dirname,
    path.join(__dirname, '../../../dist/tools/src')
];
module.parent == null && main().catch(console.error);
async function main() {
    const [scriptName] = process.argv.slice(2);
    if (!scriptName) {
        printUsage(0);
    }
    const scriptFile = scriptLocation(scriptName);
    if (!fs.existsSync(scriptFile)) {
        console.error(`script ${scriptName} not found`);
        printUsage(1);
    }
    const child = fork(scriptFile, process.argv.slice(3));
    // process.on('SIGTERM', () => child.kill('SIGTERM'));
    // process.on('SIGINT', () => child.kill('SIGINT'));
}

function printUsage(exitCode) {
    const scripts = availableScripts();
    console.log(`usage: npm run script <script-name> [-- <script-arguments>]`);
    console.log(`available scripts:`);
    console.log(scripts.map(x => `  - ${x}`).join('\n'));
    if (exitCode != null) {
        process.exit(exitCode);
    }
}
function availableScripts() {
    const files = SCRIPT_DIRECTORIES
        .reduce((acc, dir) => acc.concat(fs.readdirSync(dir)), []);

    return files
        .filter(x => SCRIPT_EXTENSION_REGEX.test(x))
        .map(x => x.replace(SCRIPT_EXTENSION_REGEX, ''))
        .filter(x => x !== 'run');
}

function scriptLocation(scriptName) {
    return SCRIPT_DIRECTORIES
        .map(dir => path.join(dir, `${scriptName}.js`))
        .find(fs.existsSync);
}
