import { dirname } from 'path';

/**
 * @param path file or directory path
 */
export function getParentDirs(path: string): string[] {
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
