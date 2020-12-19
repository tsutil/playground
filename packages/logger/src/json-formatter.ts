import fclone from 'fclone';

export function jsonFormatter(prefix?: string) {
    return (logEntry: { [key: string]: any }) => {
        logEntry = logEntry || {};
        if(prefix != null){
            logEntry.prefix = logEntry.prefix || prefix;
        }
        try {
            const clone = fclone(logEntry);
            return JSON.stringify(clone);
        } catch (e) {
            console.error(e);
            return logEntry.msg;
        }
    };
}
