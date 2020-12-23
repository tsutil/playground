// https://docs.github.com/en/free-pro-team@latest/rest/reference/repos
// https://octokit.github.io/rest.js/v18#authentication
// https://github.blog/2020-04-09-from-48k-lines-of-code-to-10-the-story-of-githubs-javascript-sdk/
import { createLogger } from '@tsutil/logger';
import { Octokit } from '@octokit/rest';

const logger = createLogger('git');
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

if (typeof GITHUB_USERNAME !== 'string') {
    logger.warn(`GITHUB_USERNAME is not configured`);
}
if (typeof GITHUB_ACCESS_TOKEN !== 'string') {
    logger.warn(`GITHUB_ACCESS_TOKEN is not configured`);
}

export const github = new Octokit({
    auth: GITHUB_ACCESS_TOKEN,
    log: logger,
});

