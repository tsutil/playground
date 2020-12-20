import 'tsconfig-paths/register';
import '@tsutil/dotenv';
import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { dump, sleep } from '@tsutil/utils';
import { createLogger } from '@tsutil/logger';
import { Octokit } from '@octokit/rest';
import { mongo } from '@tsutil/mongo';

const REPO_COLLECTION = ['git', 'repo'];
const WORKSPACE_COLLECTION = ['git', 'workspace'];
const logger = createLogger('github');
module.parent == null && main().catch(console.error).then(() => mongo.disconnect());
async function main() {
    if (typeof process.env.GITHUB_ACCESS_TOKEN !== 'string') {
        logger.info(`GITHUB_ACCESS_TOKEN is not configured`);
        return process.exit(1);
    }
    logger.info(`using access token: ${process.env.GITHUB_ACCESS_TOKEN.slice(0, 5)}...`);
    // await cloneAll();
    await query();

}

async function fetchRepos() {
    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN
    });
    const res = await octokit.paginate('GET /orgs/{org}/repos', {
        org: process.env.GITHUB_ORG_NAME,
        // per_page: 50,
        // sort: 'updated',
        // direction: 'desc',
    });
    // octokit.repos.p
    logger.info(`${res.length} items found`);
    const repos = res.map(mapRepo);
    await mongo.upsert(REPO_COLLECTION, repos);
    // await dump.json(res, 'github-response.json');
}

async function query() {
    const aggr = [
        { $match: {
            language: { $in: [
                'Vue',
            ]},
        }},
        { $project: {
            _id: 0,
            name: '$name',
            language: '$language',
            description: '$description',
            pushed_at: '$pushed_at',
            updated_at: '$updated_at',
            created_at: '$created_at',
            html_url: '$html_url',
        }},
        // {$sortByCount: '$language'},
        { $sort: { pushed_at: -1, updated_at: -1 }}
    ];
    const res = await mongo.findAll(REPO_COLLECTION, aggr);
    await dump.json(res, 'mongo-query-result.json');
}

async function transform() {
    const cursor = await mongo.find(REPO_COLLECTION, {});
    for await (const dto of cursor) {
        const repo = mapRepo(dto);
        await mongo.upsert(['git', 'repo2'], repo);
    }
}

async function cloneAll() {
    const basePath = process.env.WORKSPACE_ROOT_DIRECTORY || process.cwd();
    const filter = {};
    const repos = await mongo.find(REPO_COLLECTION, filter);
    let cloned = 0;

    for await (const repo of repos) {
        const { name, full_name, git_url, clone_url, description } = repo;
        const dir = path.join(basePath, name);
        const existing = await mongo.findOne(WORKSPACE_COLLECTION, { _id: full_name });
        if (existing != null) {
            logger.info(`${name} already clonned`);
            continue;
        }
        logger.info(`processing ${name}, ${cloned++} cloned`);
        await git.clone({
            fs,
            http,
            dir,
            url: clone_url,
            onAuth: () => ({
                username: process.env.GITHUB_USERNAME,
                password: process.env.GITHUB_ACCESS_TOKEN,
            }),
        });
        const workspace = {
            _id: full_name,
            description,
            name,
            dir,
            git_url,
            clone_url,
        };
        await mongo.upsert(WORKSPACE_COLLECTION, workspace);
        // const dir = path.join(basePath, name);
        // git.clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs' }).then(console.log);
    }
    logger.info(`total ${cloned} cloned`);
}

function mapRepo(dto) {
    if (dto == null) {
        return dto;
    }
    const repo = {
        _id: dto.full_name,
        name: dto.name,
        language: dto.language,
        description: dto.description,
        pushed_at: dto.pushed_at && new Date(dto.pushed_at),
        updated_at: dto.updated_at && new Date(dto.updated_at),
        created_at: dto.created_at && new Date(dto.created_at),
        html_url: dto.html_url,
        git_url: dto.git_url,
        ssh_url: dto.ssh_url,
        id: dto.id,
    };
    // ensure props sort order
    return Object.assign({}, repo, dto, repo);
}
