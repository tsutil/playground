import { format, transports, Logform } from 'winston';
import { jsonStringFormat, prettyStringFormat } from '../formats';
import type { LoggerOptions } from '../logger-interface';

export function consoleTransport(opt?: LoggerOptions) {
    const envName = process.env.NODE_ENV || 'dev';
    const enabled = process.env.LOGGER_CONSOLE_DISABLED != 'true';
    const level = process.env.LOGGER_CONSOLE_LOG_LEVEL || 'debug';
    if (!enabled) {
        return null;
    }
    const stringFormat = envName !== 'production'
        ? prettyStringFormat({ colorize: true, ...opt })
        : jsonStringFormat(opt);

    return new transports.Console({
        level,
        format: format.combine(
            format.timestamp(),
            stringFormat
        )
    });
}
