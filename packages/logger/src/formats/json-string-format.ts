import { format, Logform } from 'winston';
import { serializableErrorReplacer } from '../serializable-error';
import stringify from 'safe-json-stringify';
import type { LoggerOptions } from '../logger-interface';

export function jsonStringFormat(opt?: LoggerOptions): Logform.Format {
    return format.printf(entry => stringify(entry, serializableErrorReplacer ));
}
