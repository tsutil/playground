import * as path from 'path';
import * as fs from 'fs-extra';

let projectDir = null;
export function getProjectDirectory() {
    if (projectDir != null) {
        return projectDir;
    }
    const dirs = [
        '..',
        '../..',
        '../../..',
        '../../../..',
    ].map(x => path.join(__dirname, x));
    for (const dir of dirs) {
        if (fs.existsSync(path.join(dir, 'package.json'))) {
            projectDir = dir;
            return projectDir;
        }
    }
    projectDir = path.join(__dirname, '../..');
    return projectDir;
}
