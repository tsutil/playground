import test from 'tape-promise/tape';
import * as fs from 'fs-extra';

import { getProjectDirectory } from './project-directory';

test(`getProjectDirectory()`, async (t) => {
    const actual = getProjectDirectory();
    const stat = await fs.stat(actual);

    t.true(stat.isDirectory, `should return path to directory`);
});
