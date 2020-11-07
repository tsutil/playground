const path = require('path');
const { resolveModuleAliases } = require('./utils/resolve-module-alias');

module.parent == null && main().catch(console.error);
async function main() {
    const [packageJson, src] = process.argv.slice(2, 4)
        .map(x => x && path.resolve(x));

    if (!packageJson || !src) {
        printUsage(1);
    }

    await resolveModuleAliases({ packageJson, src });
}

async function printUsage(exitCode) {
    console.log(`usage: resolve-alias <package.json> <source>`);
    if (exitCode != null) {
        process.exit(exitCode);
    }
}
