import { format, transports, Logform } from 'winston';
import { jsonStringFormat, prettyStringFormat } from '../formats';
import type { LoggerOptions } from '../logger-interface';

const ENABLED = process.env.LOGGER_CONSOLE_DISABLED != 'true';
const LEVEL = process.env.LOGGER_CONSOLE_LOG_LEVEL || 'debug';
const PRETTIFY = process.env.LOGGER_PRETTIFY_CONSOLE_OUTPUT != null
    ? process.env.LOGGER_PRETTIFY_CONSOLE_OUTPUT === 'true'
    : ['dev', 'development'].includes(process.env.NODE_ENV || 'dev');

export function consoleTransport(opt?: LoggerOptions) {
    if (!ENABLED) {
        return null;
    }
    const stringFormat = PRETTIFY
        ? prettyStringFormat({ colorize: true, ...opt })
        : jsonStringFormat(opt);

    return new transports.Console({
        level: LEVEL,
        format: format.combine(
            format.timestamp(),
            stringFormat
        )
    });
}
