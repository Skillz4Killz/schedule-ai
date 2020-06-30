import { Command, CommandStore } from "klasa";
import { Message } from "@klasa/core";
import { prisma } from "..";
import { sendErrorResponse, sendMessage } from "../utils/responses";
import { humanizeMilliseconds } from "../utils/transform";

export default class extends Command {
  constructor(store: CommandStore, directory: string, files: string[]) {
    super(store, directory, files, {
      cooldown: 3000,
    });
  }

  async run(message: Message) {
    // Gets all reminders for this user.
    const reminders = await prisma.reminders.findMany({
      where: { userID: message.author.id },
      select: { id: true, timestamp: true, content: true },
    });

    // if there are no reminders
    if (!reminders.length) return sendErrorResponse(message.channel.id, message.language.get("REMIND_NONE"));

    // List out all the reminders
    return sendMessage(
      message.channel.id,
      {
        content: reminders
          .map((reminder) => {
            const time = humanizeMilliseconds(reminder.timestamp.getTime() - message.createdTimestamp);
            return `**${reminder.id}: ${time}** => ${reminder.content}`;
          })
          .join("\n"),
      },
      {
        char: "\n",
      }
    );
  }
}
