// https://isomorphic-git.org/docs/en
// https://github.com/isomorphic-git/isomorphic-git
import fs from 'fs-extra';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { createLogger } from '@tsutil/logger';

const logger = createLogger('git');

const GIT_USERNAME = process.env.GIT_USERNAME || process.env.GITHUB_USERNAME;
const GIT_PASSWORD = process.env.GIT_PASSWORD || process.env.GITHUB_ACCESS_TOKEN;

if (typeof GIT_USERNAME !== 'string') {
    logger.warn(`GIT_USERNAME is not configured`);
}
if (typeof GIT_PASSWORD !== 'string') {
    logger.warn(`GIT_PASSWORD is not configured`);
}
export const onAuth = () => ({
    username: GIT_USERNAME,
    password: GIT_PASSWORD,
});

/**
* @example
* await git.clone({
*     fs,
*     http,
*     dir,
*     onAuth,
*     url: clone_url,
* });
*/
export { git, fs, http };

