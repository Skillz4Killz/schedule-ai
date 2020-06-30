import { Command, CommandStore } from "klasa";
import { Message } from "@klasa/core";
import { prisma } from "..";
import { sendSuccessResponse } from "../utils/responses";

export default class extends Command {
  constructor(store: CommandStore, directory: string, files: string[]) {
    super(store, directory, files, {
      aliases: ["remindme", "reminder", "r"],
      usage: "<time:duration> [interval:duration] <content:...string>",
      promptLimit: 10,
      cooldown: 3000,
    });
  }

  async run(message: Message, [time, interval, content]: [Date, Date | undefined, string]) {
    sendSuccessResponse(
      message.channel.id,
      message.language.get(interval ? "REMIND_RECURRING_CREATED" : "REMIND_CREATED")
    );

    // Need the await to save properly
    await prisma.reminders.create({
      data: {
        reminderID: message.id,
        guildID: message.guild!.id,
        channelID: message.channel.id,
        userID: message.author.id,
        interval: interval ? interval.getTime() - message.createdTimestamp : 0,
        content,
        timestamp: time,
      },
    });

    return message.responses;
  }
}
