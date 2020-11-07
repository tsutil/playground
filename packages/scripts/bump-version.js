const fs = require('fs-extra');
const glob = require('tiny-glob');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '../../..');

module.parent == null && main().catch(console.error);
async function main() {
    const version = process.argv[2];
    const matchPattern = process.argv[3] || 'packages/inventory*/package.json';
    if(!version){
        printUsage(1);
    }
    const files = await glob(matchPattern, {
        cwd: ROOT_DIR,
        absolute: true,
        filesOnly: true,
    });
    if(!process.argv[3]){
        files.push(path.join(ROOT_DIR, 'package.json'));
    }
    for(const file of files){
        await bumpPackageVersion(file, version);
    }
}

async function bumpPackageVersion(packageJson, version){
    const pkg = await fs.readJson(packageJson);
    pkg.version = version;
    await fs.writeJson(packageJson, pkg, { spaces: 2 });
    console.log(`${version} => ${packageJson}`);
}

async function printUsage(exitCode) {
    console.log(`usage: bump-version <version>`);
    if (exitCode != null) {
        process.exit(exitCode);
    }
}
