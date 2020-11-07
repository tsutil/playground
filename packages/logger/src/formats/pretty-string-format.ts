import { format, Logform } from 'winston';
import type { LoggerOptions } from '../logger-interface';

export function prettyStringFormat(opt?: LoggerOptions): Logform.Format {
    const prefix = opt?.prefix && `(${opt.prefix}) ` || '';
    const stringFormatter = info => {
        const { level, message, timestamp } = info;
        const error: any = Object.values(info).find(x => x instanceof Error);
        const errDetails = error != null
            ? `\n${error.stack}`
            : '';

        return info instanceof Error
            ? `${info.message}\n\n${info.stack}\n`
            : `[${timestamp}] [${level}] ${prefix}${message}${errDetails}`;
    };
    const formats: Logform.Format[] = [];
    if (opt?.colorize) {
        formats.push(format.colorize());
    }
    formats.push(format.printf(stringFormatter));

    return format.combine(...formats);
}
