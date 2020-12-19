import fclone from 'fclone';
import { format, Logform } from 'winston';
import { beautifyErrorReplacer } from '../beautify-error-replacer';
import type { LoggerOptions } from '../logger-interface';

export function jsonStringFormat(opt?: LoggerOptions): Logform.Format {
    return format.printf(entry =>
        JSON.stringify(fclone(entry), beautifyErrorReplacer ));
}
