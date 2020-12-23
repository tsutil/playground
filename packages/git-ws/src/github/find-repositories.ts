import { github } from './github-client';
import { createLogger } from '@tsutil/logger';
import type { GitRepository } from '../git-types';
import type { GithubRepository } from './github-types';

const logger = createLogger('github');

export async function* findRepositories({ org, sort = 'updated', direction = 'desc' }: {
    org: string,
    sort?: 'created' | 'updated' | 'pushed' | 'full_name',
    direction?: 'asc' | 'desc',
}) {
    let pageNumber = 0;
    while (true) {
        logger.debug(`list repositories for organization (page ${pageNumber})`);
        const res = await github.repos.listForOrg({
            org,
            sort,
            direction,
            page: pageNumber++,
        });
        if (!res.data?.length) {
            break;
        }
        for (const githubRepository of res.data) {
            const repo = mapRepo(githubRepository);
            yield { repo, githubRepository };
        }
    }
}

function mapRepo(dto): GitRepository {
    if (dto == null) {
        return dto;
    }
    const repo: GitRepository = {
        _id: dto.full_name,
        source: 'github',
        externalId: dto.id,
        path: dto.full_name,
        name: dto.name,
        owner: dto.owner?.login,
        language: dto.language,
        description: dto.description,
        htmlUrl: dto.html_url,
        gitUrl: dto.git_url,
        sshUrl: dto.ssh_url,
        pushedAt: dto.pushed_at && new Date(dto.pushed_at),
        updatedAt: dto.updated_at && new Date(dto.updated_at),
        createdAt: dto.created_at && new Date(dto.created_at),
    };
    return repo;
}
