import { createLogger as createWinstonLogger } from './winston-logger';
import { ILogger, LoggerOptions } from './logger-interface';

export function createLogger(prefix?: string): Logger;
export function createLogger(prefix?: string, context?: any): Logger;
export function createLogger(opt: LoggerOptions): Logger;
export function createLogger(opt: LoggerOptions, context?: any): Logger;

export function createLogger(opt?: LoggerOptions | string, context?: any): Logger {
    if (typeof opt === 'string') {
        opt = { prefix: opt };
    }
    opt = {
        logger: createWinstonLogger(opt),
        ...opt,
    };
    return new Logger(opt, context);
}

/**
 * Hijackable logger facade.
 */
export class Logger implements ILogger {
    logger: ILogger;
    private opt: LoggerOptions;
    private context: any;

    constructor(opt: LoggerOptions, context?: any) {
        this.opt = opt;
        this.logger = this.opt.logger;
    }

    verbose(message: string, context?: any): void {
        return this.log('verbose', message, context);
    }

    debug(message: string, context?: any) {
        return this.log('debug', message, context);
    }

    info(message: string, context?: any) {
        return this.log('info', message, context);
    }

    warn(message: string, context?: any) {
        return this.log('warn', message, context);
    }

    /**
     * @param message error message
     * @param context optional diagnostics context
     */
    error(message: string, context?: any): void;

    /**
     * @param message error message
     * @param context optional error and diagnostics context
     */
    error(message: string, context?: any | { error: Error }): void;

    /**
     * @param message error message
     * @param context optional error and diagnostics context
     */
    error(message: string, context?: any | { error: Error }): void {
        return this.log('error', message, context);
    }

    log(level: string, message: string, context?: any): void {
        context = context instanceof Error && { ...this.context, error: context }
            || context != null && { ...this.context, ...context }
            || undefined;

        this.logger.log(level, message, context);
    }
}
