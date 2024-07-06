export function getTimestampFromDate(date: Date) {
    return date.getTime() / 1000;
}

export function getCurrentTimeStamp() {
    return new Date().getTime() / 1000;
}

export function getFormattedTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);

    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Use 12-hour format with AM/PM
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDateTime = formatter.format(date);
    return formattedDateTime;
}
