import * as path from 'path';
import { getProjectDirectory } from './project-directory';

const tempDirectory = process.env.TEMP_DIRECTORY || path.join(getProjectDirectory(), 'temp');

export function file(...paths) {
    if (!paths || paths[0] == null) {
        throw new Error('File path should not be empty');
    }
    return path.isAbsolute(paths[0])
        ? path.join(paths[0], ...paths.slice(1))
        : path.join(tempDirectory, ...paths);
}
export function directory(...paths) {
    if (!paths || paths[0] == null) {
        return tempDirectory;
    }
    return path.join(tempDirectory, ...paths);
}
