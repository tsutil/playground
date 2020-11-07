const fs = require('fs-extra');
const glob = require('tiny-glob');
const path = require('path');
const { createBuildId } = require('./utils/build-id');

const ROOT_DIR = path.join(__dirname, '../../..');

module.parent == null && main().catch(console.error);
async function main() {
    await bumpBuildVersionRecursively();
}

/**
 *
 * @param {object} [opt]
 * @param {string} [opt.baseDir]
 * @param {string} [opt.version]
 * @param {string} [opt.buildPrefix]
 */
async function bumpBuildVersionRecursively(opt) {
    opt = {
        baseDir: path.join(ROOT_DIR, 'dist'),
        version: createBuildId(),
        buildPrefix: defaultPrefix(),
        ...opt,
    };
    const buildPrefix = opt.buildPrefix ? `${opt.buildPrefix}-` : '';
    const sanitizedPrifix = buildPrefix.replace(/[^0-9A-Za-z-]/g, '-');
    const versionSuffix = `${sanitizedPrifix}${opt.version}`;
    const matchPattern = '**/swagger/**/swagger.json';

    const files = await glob(matchPattern, {
        cwd: opt.baseDir,
        absolute: true,
        filesOnly: true,
    });
    for (const file of files) {
        try {
            await bumpOpenApiBuildVersion(file, versionSuffix);
        } catch (error) {
            console.error(`failed to bump build version for ${file}`);
        }
    }
}
module.exports.bumpBuildVersionRecursively = bumpBuildVersionRecursively;

async function bumpOpenApiBuildVersion(file, version) {
    const content = await fs.readJson(file);
    if (content.info && content.info.version) {
        const base = content.info.version.replace(/\-.*$/, '');
        console.log(`${base}-${version}`);
        content.info.version = `${base}-${version}`;
        await fs.writeJson(file, content, { spaces: 4 });
    }
}

function defaultPrefix() {
    // todo: find a way to access build metadata env variables

    // if (process.env.DEPLOYER_ENVIRONMENT === 'production') {
    //     return 'prod';
    // }
    // if (process.env.DEPLOYER_ENVIRONMENT === 'staging') {
    //     return process.env.DEPLOYER_GIT_REFERENCE || 'qa';
    // }
    // return 'dev';
    return null;
}
