// @ts-check
const fs = require('fs-extra');
const path = require('path');
const chileProcess = require('child_process');
const { promisify } = require('util');

const exec = promisify(chileProcess.exec);
const cp = (src, dest, ...args) => exec(`cp ${src} ${dest} ${args.join(' ')}`);

const ROOT_DIRECTORY = path.join(__dirname, '../..');
const PACKAGES_DIRECTORY = path.join(ROOT_DIRECTORY, 'packages');
const PACKAGE_TEMPLATE_DIR = path.join(__dirname, 'package-template');
const PACKAGE_TEMPLATE_FILE = path.join(PACKAGE_TEMPLATE_DIR, 'package-template.json');

module.parent == null && main().catch(console.error);
async function main() {
    const args = process.argv.slice(2);
    const name = args[0] || 'new-package';
    const packageFullName = `@tsutil/${name}`;
    if (typeof name != 'string') {
        printUsage(1);
    }

    const package = await fs.readJson(PACKAGE_TEMPLATE_FILE);
    package.name = packageFullName;

    const packageDirectory = path.join(PACKAGES_DIRECTORY, name);
    const packageFile = path.join(packageDirectory, `package.json`);

    await fs.ensureDir(packageDirectory);
    const templateFiles = await templateEntries();
    for (const entry of templateFiles) {
        await cp(entry.path, path.join(packageDirectory, entry.name), '-r');
    }
    // @ts-ignore
    if (await fs.exists(packageFile)) {
        console.warn(`file ${packageFile} already exists, terminating`);
        printUsage(1);
    } else {
        await fs.writeJson(packageFile, package, { spaces: 4 });
    }
    console.log(`created new package: ${packageFile}`);
}

async function printUsage(exitCode) {
    console.log(`usage: npm run script add-package <package-name>`);
    if (exitCode != null) {
        process.exit(exitCode);
    }
}

async function templateEntries() {
    const entries = await fs.readdir(PACKAGE_TEMPLATE_DIR);
    return entries
        .filter(x => x != 'package-template.json')
        .map(x => ({ name: x, path: path.join(PACKAGE_TEMPLATE_DIR, x) }));
}
