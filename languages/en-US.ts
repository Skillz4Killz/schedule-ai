import { Language } from "klasa";

export default class extends Language {
  language = {
    DEFAULT: (key: string) => `The key ${key} has not been translated yet.`,

    // Slowmode
    SLOWMODE_SPAM_CLEAR: (username: string) =>
      `${username} was spamming commands. Auto-deleting to clear spam in your server.`,

    // Remind Command
    REMIND_NEED_TIME:
      "You did not provide the time to start. Please try again and provide a time to start such as: 5m or 4d3h2m",
    REMIND_NEED_CONTENT:
      "You did not provide the reminder text to send when reminding you at this time. Please type some context so you are able to know what this reminder is for.",
    REMIND_CREATED: "A reminder has been created. I will remind you about this when it is time.",
    REMIND_RECURRING_CREATED:
      "A recurring reminder has been created. I will remind you every so often about this when it is time.",
    REMIND_NONE: "There are no reminders found for you. To create a reminder, use the `remind` command.",
    REMIND_ID: (id: number) => `Reminder ID: ${id}`,
    REMIND_DELETED: (id: number) => `The reminder with the ID **${id}** has been removed from your account.`,
    REMIND_OTHER_USER: (id: number) =>
      `The reminder with the ID **${id}** does not belong to your account. Only the user who created the reminder can remove the reminder.`,
    REMIND_NOT_FOUND: (id: number) =>
      `The reminder with the ID **${id}** was not found in the database. Please try again with another ID.`,

    // Events Command
    EVENTS_NONE: "There are no events currently on this server. To create an event, use the eventcreate command.",
    EVENTS_STARTS_IN: (time: number) => `starts in \`${time}\``,
    EVENTS_ENDS_IN: (time: number) => `ends in \`${time}\``,
    EVENTS_ENDED: (time: number) => `ended \`${time}\` ago`,
  };
}
