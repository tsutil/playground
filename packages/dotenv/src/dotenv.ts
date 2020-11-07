// @ts-check
import * as fs from 'fs';
import { join, dirname } from 'path';
import * as dotenv from 'dotenv';
import { createLogger } from '@tsutil/logger';

const envName = process.env.NODE_ENV || 'dev';
const logger = createLogger('dotenv');
const loaded = {};

/**
 * Read environment variables from {project_root}/{env_name}.env file
 * @param {string?} [env]
 */
function init(env = envName) {
    if (loaded[env] !== undefined) {
        return loaded[env];
    }

    let error, envOverride = null;
    try {
        const parentDirs = getParentDirs(__dirname);
        const configLocation = parentDirs
            .map(x => join(x, `${env}.env`))
            .find(x => fs.existsSync(x));

        if (configLocation != null) {
            const res = dotenv.config({ path: configLocation });
            envOverride = res.parsed;
            error = res.error;
        }
    } catch (err) {
        error = err;
    } finally {
        if (error) {
            logger.info(`Failed to load ${env} dotenv config. ${error.message}`, { env, error });
        } else {
            const propCount = Object.keys(envOverride || {}).length;
            logger.info(`${propCount} variables loaded from ${env}.env file.`);
        }
        loaded[env] = envOverride;
    }
    return loaded[env];
}
/**
 * If module imported - try read dotenv files if haven't already
 */
export const dotenvConfig = init();

/**
 * @param path file or directory path
 */
function getParentDirs(path: string): string[] {
    const dirs: string[] = [];
    let dir = path;
    let total = 30;
    while (total--) {
        const parent = dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
        dirs.push(dir);
    }
    return dirs;
}
