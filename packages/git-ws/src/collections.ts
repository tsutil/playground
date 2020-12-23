export const GIT_DB_NAME = process.env.GIT_DB_NAME || 'git';

export const collections = {
    GITHUB_REPOSITORY: [GIT_DB_NAME, 'github.repository'],
    REPOSITORY: [GIT_DB_NAME, 'repository'],
    WORKSPACE: [GIT_DB_NAME, 'workspace'],
};

export const indexes = [
    [collections.GITHUB_REPOSITORY, ['updatedAt', 'pushedAt']],
    [collections.REPOSITORY, ['updatedAt', 'pushedAt']],
    [collections.WORKSPACE, []],
];
