import winston from 'winston';
import { consoleTransport, fileTransport } from './transports';
import type { ILogger, LoggerOptions } from './logger-interface';

const instances: { [prefix: string]: winston.Logger } = {};

export function createLogger(opt?: LoggerOptions): ILogger {
    const cacheKey = opt?.prefix || 'default';
    if (instances[cacheKey]) {
        return instances[cacheKey];
    }
    const defaultLogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
    const level = process.env.LOGGER_DEFAULT_LOG_LEVEL || defaultLogLevel;
    const transports = [
        consoleTransport(opt),
        fileTransport(opt),
    ].filter(x => x != null);
    return instances[cacheKey] = winston.createLogger({ level, transports });
}
