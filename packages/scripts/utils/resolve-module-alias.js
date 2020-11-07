const fs = require('fs-extra');
const path = require('path');
const glob = require('tiny-glob');
const shell = require('shelljs');

/** @typedef ResolveModuleAliasOptions
 * @property {string} packageJson
 * @property {string} src
 * @property {string} [packageRoot]
 * @property {string} [matchPattern]
 */

/**
 * Replace module references with absolute paths.
 * Use package.json file for {@link https://github.com/ilearnio/module-alias|module-alias} definitions
 * @param {ResolveModuleAliasOptions} opt
 */
async function resolveModuleAliases(opt) {
    opt = {
        matchPattern: '**/*.{js,ts}',
        packageRoot: opt.src,
        ...opt,
    };
    const rootDir = path.dirname(opt.packageJson);
    const moduleMap = fs.readJsonSync(opt.packageJson)._moduleAliases;
    const files = await glob(opt.matchPattern, {
        cwd: opt.src,
        absolute: true,
        filesOnly: true,
    });

    for (const [key, value] of Object.entries(moduleMap)) {
        moduleMap[key] = value.replace('dist', opt.packageRoot);
    }
    for(const filePath of files){
        for (const [alias, modulePath] of Object.entries(moduleMap)) {
            const dirPath = path.dirname(filePath);
            const relativeReference = path.relative(dirPath, modulePath).replace(/\\/g, '/');
            shell.sed('-i', `[\'\"]${alias}[\'\"]`, `'${relativeReference}'`, filePath);
        }
    }
}
module.exports.resolveModuleAliases = resolveModuleAliases;
