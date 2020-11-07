import toJson from 'safe-json-stringify';

export function jsonFormatter(prefix?: string) {
    return (logEntry: { [key: string]: any }) => {
        logEntry = logEntry || {};
        if(prefix != null){
            logEntry.prefix = logEntry.prefix || prefix;
        }
        try {
            return toJson(logEntry);
        } catch (e) {
            console.error(e);
            return logEntry.msg;
        }
    };
}
