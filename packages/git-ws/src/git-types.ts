export interface GitRepository {
    _id?: string;
    source?: 'github';
    externalId?: string;
    name?: string;
    owner?: string;
    fullName?: string;
    path?: string;
    language?: string;
    description?: string;
    pushedAt?: Date;
    updatedAt?: Date;
    createdAt?: Date;
    htmlUrl?: string;
    gitUrl?: string;
    sshUrl?: string;
}
