import moment from "moment";

export function getTimestampFromDate(date: Date) {
    return date.getTime() / 1000;
}

export function getCurrentTimeStamp() {
    return new Date().getTime() / 1000;
}

export function getFormattedTimestamp(timestamp: number, options?: Intl.DateTimeFormatOptions) {
    const date = new Date(timestamp * 1000);

    const defaultOptions: Intl.DateTimeFormatOptions = options || {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Use 12-hour format with AM/PM
    };

    const formatter = new Intl.DateTimeFormat("en-US", options || defaultOptions);
    const formattedDateTime = formatter.format(date);
    return formattedDateTime;
}

export function getDaysDifferenceFromTimestamp(d1: number, d2?: number) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const date1 = new Date(d1 * 1000);
    const date2 = d2 ? new Date(d2 * 1000) : new Date();

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    const diff = Math.floor((utc1 - utc2) / MS_PER_DAY);
    return diff;
}

export function addDaysToDate(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

export function useSleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getCurrentTimeDifferenceInText(date: Date | number) {
    const currentDate = moment();
    let inputDate;
    if (typeof date === "number") {
        // handling Unix Timestamp format
        inputDate = moment(date * 1000);
    } else {
        // handling js date object
        inputDate = moment(date);
    }

    const diff = moment.duration(currentDate.diff(inputDate));

    if (diff.asSeconds() < 60) {
        return `${Math.floor(diff.asSeconds())} seconds ago`;
    } else if (diff.asMinutes() < 60) {
        return `${Math.floor(diff.asMinutes())} minutes ago`;
    } else if (diff.asHours() < 24) {
        return `${Math.floor(diff.asHours())} hours ago`;
    } else if (diff.asMonths() < 12) {
        const months = Math.floor(diff.asMonths());
        currentDate.subtract(months, "months");
        const days = currentDate.diff(inputDate, "days");
        return `${months} months ${days} days ago`;
    } else {
        const years = currentDate.diff(inputDate, "years");
        currentDate.subtract(years, "years");
        // const months = currentDate.diff(inputDate, "months");
        // currentDate.subtract(months, "months");
        // const days = currentDate.diff(inputDate, "days");
        // return `${years} years ${months} months ${days} days ago`;
        return `${years} years ago`;
    }
}
