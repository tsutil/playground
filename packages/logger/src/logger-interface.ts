export interface ILogger {
    log: LogMethod;
    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    verbose: LeveledLogMethod;
}

interface LogMethod {
    (level: string, message: string, meta: any): void;
    (level: string, message: string): void;
}

interface LeveledLogMethod {
    (message: string): void;
    (message: string, meta: any): void;
}

export interface LoggerOptions {
    /**
     * Underlying implementation, e.g. winston logger
     */
    logger?: ILogger;
    prefix?: string;
    colorize?: boolean;
}
