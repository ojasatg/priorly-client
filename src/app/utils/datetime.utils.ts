import { getTimestampFromDate } from "$lib/utils";

export function validateDeadlineReminder(deadline?: Date, reminder?: Date) {
    // Some manual validation because date time component is not working correctly
    const deadlineTimestamp = deadline ? getTimestampFromDate(deadline) : undefined;
    const reminderTimestamp = reminder ? getTimestampFromDate(reminder) : undefined;

    let deadlineErrors = "";
    let reminderErrors = "";

    const today = new Date();
    const todayTimestamp = getTimestampFromDate(today);

    if (deadlineTimestamp && deadlineTimestamp <= todayTimestamp) {
        deadlineErrors = "Deadline cannot be lesser than today's date";
    } else if (reminderTimestamp && reminderTimestamp <= todayTimestamp) {
        reminderErrors = "Reminder cannot be lesser than current date and time";
    } else if (deadlineTimestamp && reminderTimestamp && reminderTimestamp > deadlineTimestamp) {
        reminderErrors = "Reminder cannot be after the Deadline";
    } else {
        deadlineErrors = "";
        reminderErrors = "";
    }

    return {
        deadlineErrors,
        reminderErrors,
    };
}
