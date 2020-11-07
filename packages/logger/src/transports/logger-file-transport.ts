import { join } from 'path';
import { format, transports } from 'winston';
import { prettyStringFormat } from '../formats';
import type { LoggerOptions } from '../logger-interface';

export function fileTransport(opt?: LoggerOptions) {
    const envName = process.env.NODE_ENV || 'dev';
    const enabled = process.env.LOGGER_FILE_ENABLED == 'true' || envName === 'dev';
    const level = process.env.LOGGER_FILE_LOG_LEVEL || 'debug';
    const logFileName = process.env.LOGGER_LOG_FILE_NAME
        || process.env.APP_NAME && `${process.env.APP_NAME}-${envName}`
        || `logs-${envName}.logs`;

    const logDirectory = process.env.LOGGER_LOG_DIRECTORY
        || join(__dirname, '../../../../logs');

    if (!enabled) {
        return null;
    }
    const maxSizeMb = process.env.LOGGER_FILE_LOG_SIZE_MB
        && Number(process.env.LOGGER_FILE_LOG_SIZE_MB)
        || 10;

    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    return new transports.File({
        level,
        filename: join(logDirectory, logFileName),
        maxsize: maxSizeBytes,
        format: format.combine(
            format.timestamp(),
            prettyStringFormat({ ...opt, colorize: false }),
        )
    });
}
