const shell = require('shelljs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const util = require('util');
const pack = util.promisify(webpack);

module.parent == null && main().catch(console.error);
async function main() {
    let [entry, outDir] = process.argv.slice(2, 4).map(x => path.resolve(x));
    if (!entry || !outDir) {
        printUsage(1);
    }
    const outFile = path.join(outDir, path.basename(entry));
    const config = {
        entry,
        mode: 'development',
        target: 'async-node',
        externals: [nodeExternals()],
        plugins: [
            new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
        ],
        output: {
            filename: path.basename(entry),
            path: outDir,
            libraryTarget: 'commonjs2',
        }
    };
    const stats = await pack(config);
    console.log(stats.toString() + '\n');
    await shell.chmod('+x', outFile);
}

async function printUsage(exitCode) {
    console.log(`usage: pack <entry-file> <out-dir>`);
    if (exitCode != null) {
        process.exit(exitCode);
    }
}
