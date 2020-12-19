import fs from 'fs-extra';
import fclone from 'fclone';
import * as temp from './temp';
import ObjectsToCsv from 'objects-to-csv';

/**
 * Write content to file. test/temp directory is used by default.
 */
export async function text(content: string | Buffer, ...paths: string[]): Promise<string> {
    content = Array.isArray(content) && content.join('\n')
        || (content != null ? content : '');

    const filePath = temp.file(...paths);
    await fs.outputFile(filePath, content);
    console.log(filePath);
    return filePath;
}
/**
 * Write object to json file. test/temp directory is used by default.
 */
export async function json(content: any, ...paths: string[]): Promise<string> {
    if (content == null) {
        return null;
    }
    const filePath = temp.file(...paths);

    content = fclone(content);
    await fs.outputJSON(filePath, content, { spaces: 4 });
    console.log(filePath);
    return filePath;
}

/**
 * Write array of objects to csv file.
 * test/temp directory is used by default.
 */
export async function csv(content: any[], ...paths: string[]): Promise<string> {
    content = content == null && []
        || !Array.isArray(content) && [content]
        || content;

    const rows = content.map(x => {
        const clone = { ...x };
        for (const [k, v] of Object.entries(clone)) {
            if (v instanceof Date) {
                clone[k] = v.toISOString();
            }
        }
        return clone;
    });
    const filePath = temp.file(...paths);
    const text = await new ObjectsToCsv(rows).toString();
    await fs.outputFile(filePath, text);
    console.log(filePath);
    return filePath;
}
