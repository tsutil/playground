const path = require('path');
const { parseArguments } = require('./utils/parse-args');
const { copy } = require('./utils/fs-utils');
const { bumpBuildVersionRecursively } = require('./bump-build-version');

const ROOT_DIR = path.join(__dirname, '../../..');

module.parent == null && main().catch(console.error);
async function main() {
    const source = path.join(ROOT_DIR, 'packages');
    const destination = path.join(ROOT_DIR, 'dist');
    const args = parseArguments(process.argv.slice(2));
    const exclude = args.filter(x => x.key === 'exclude').map(x => x.value);
    const include = args.filter(x => x.key === 'include').map(x => x.value);
    await copy(source, destination, { include, exclude });
    await bumpBuildVersionRecursively();
}
