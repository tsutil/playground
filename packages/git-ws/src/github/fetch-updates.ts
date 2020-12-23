import 'tsconfig-paths/register';
import '@tsutil/dotenv';
import { createLogger } from '@tsutil/logger';
import { mongo } from '@tsutil/mongo';
import { findRepositories } from './find-repositories';
import { collections } from '../collections';
import type { GitRepository } from '../git-types';
import type { GithubRepository } from './github-types';
import { github } from './github-client';
import { query } from './query-github';
// import { GihubTypes } from './github-types';

const logger = createLogger('github');
const org = process.env.GITHUB_ORG_NAME;

module.parent == null && main().catch(console.error).then(() => mongo.disconnect());
async function main() {
    await fetchUpdatedRepositories({ owner: 'microsoft', repo: 'TypeScript' });
}

export async function fetchUpdatedRepositories({ owner, repo }: {
    owner: string,
    repo: string,
}) {
    github.repos.listForOrg();
    const cursor = await query('GET /repos/{owner}/{repo}/releases', {
        owner,
        repo,
        sort: 'updated',
        direction: 'desc',
    });
    for await (const item of cursor) {
        console.log(item.body);
    }

    // const res = await github.paginate('GET /repos/{owner}/{repo}/releases', {
    //     owner: '',
    //     repo: '',
    //     sort: 'updated',
    //     direction: 'desc',
    // });
    // await mongo.upsert(['git', 'releases'], res);
    // await github.repos.listReleases({
    //     //
    // })
    // const cursor = await mongo.find(collections.WORKSPACE);
    // let processed = 0;
    // for await (const item of cursor) {
    //     logger.info(`processing (${processed++}) ${item.name}`);
    //     if (processed > 10) {
    //         break;
    //     }
    // }
    // const cursor = await findRepositories({ org, sort: 'updated', direction: 'desc' });
    // for await (const { repo, githubRepository } of cursor) {

    // }

    // let pageNumber = 0;
    // while (true) {
    //     logger.debug(`list repositories for organization (page ${pageNumber})`);
    //     const res = await github.repos.listForOrg({
    //         org,
    //         sort,
    //         direction,
    //         page: pageNumber++,
    //     });
    //     if (!res.data?.length) {
    //         break;
    //     }
    //     for (const githubRepository of res.data) {
    //         const repo = mapRepo(githubRepository);
    //         yield { repo, githubRepository };
    //     }
    // }
}

// async function fetchRepos() {
//     const data = await github.repos.listForOrg({} as any);
//     data.data[0].archive_url

//     const res = await github.paginate('GET /orgs/{org}/repos', {
//         org: process.env.GITHUB_ORG_NAME,
//         // per_page: 50,
//         // sort: 'updated',
//         // direction: 'desc',
//     });
//     // octokit.repos.p
//     logger.info(`${res.length} items found`);
//     const repos = res.map(mapRepo);
//     await mongo.upsert(collections.REPOSITORY, repos);
//     // await dump.json(res, 'github-response.json');
// }

// async function query() {
//     const aggr = [
//         { $match: {
//             language: { $in: [
//                 'Vue',
//             ]},
//         }},
//         { $project: {
//             _id: 0,
//             name: '$name',
//             language: '$language',
//             description: '$description',
//             pushed_at: '$pushed_at',
//             updated_at: '$updated_at',
//             created_at: '$created_at',
//             html_url: '$html_url',
//         }},
//         // {$sortByCount: '$language'},
//         { $sort: { pushed_at: -1, updated_at: -1 }}
//     ];
//     const res = await mongo.findAll(collections.REPOSITORY, aggr);
//     await dump.json(res, 'mongo-query-result.json');
// }

// async function cloneAll() {
//     const basePath = process.env.WORKSPACE_ROOT_DIRECTORY || process.cwd();
//     const filter = {};
//     const repos = await mongo.find(collections.REPOSITORY, filter);
//     let cloned = 0;

//     for await (const repo of repos) {
//         const { name, full_name, git_url, clone_url, description } = repo;
//         const dir = path.join(basePath, name);
//         const existing = await mongo.findOne(collections.WORKSPACE, { _id: full_name });
//         if (existing != null) {
//             logger.info(`${name} already clonned`);
//             continue;
//         }
//         logger.info(`processing ${name}, ${cloned++} cloned`);
//         await git.clone({
//             fs,
//             http,
//             dir,
//             url: clone_url,
//             onAuth: () => ({
//                 username: process.env.GITHUB_USERNAME,
//                 password: process.env.GITHUB_ACCESS_TOKEN,
//             }),
//         });
//         const workspace = {
//             _id: full_name,
//             description,
//             name,
//             dir,
//             git_url,
//             clone_url,
//         };
//         await mongo.upsert(collections.WORKSPACE, workspace);
//         // const dir = path.join(basePath, name);
//         // git.clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs' }).then(console.log);
//     }
//     logger.info(`total ${cloned} cloned`);
// }
