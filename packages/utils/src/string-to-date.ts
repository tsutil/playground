import * as moment from 'moment';
export const DATE_REGEX = /^\d{4}-[01]\d-[0-3]\d/;

export function parseDate(date) {
    if (date == null || date instanceof Date) {
        return date;
    }
    if (typeof date != 'string' || !DATE_REGEX.test(date)) {
        return null;
    }
    try {
        const parsed = moment.utc(date);
        return parsed.isValid()
            ? parsed.toDate()
            : null;
    } catch (error){
        console.error(`failed to parse ${date}`);
        return null;
    }
}
