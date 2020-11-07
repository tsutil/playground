const { parseArguments } = require('./utils/parse-args');
const { copy } = require('./utils/fs-utils');

/**
 * Copy non-typescrypt related (exclude *.js/*.ts) files to dist
 */

module.parent == null && main().catch(console.error);
async function main() {
    const source = process.argv[2];
    const destination = process.argv[3];
    if (!source || !destination) {
        printUsage(1);
    }
    const args = parseArguments(process.argv.slice(4));
    const include = args.filter(x => x.key === 'include').map(x => x.value);

    const defaultExclude = '(ts|js)$';
    const exclude = args.filter(x => x.key === 'exclude').map(x => x.value)
        .concat(defaultExclude);

    await copy(source, destination, { include, exclude });
}

async function printUsage(exitCode) {
    console.log(`usage: npm run script copy-assets <source> <destination> [--include='<regexp>'] [--exclude='<regexp>']`);
    if (exitCode != null) {
        process.exit(exitCode);
    }
}
