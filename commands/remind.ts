import { Command, CommandStore } from "klasa";
import { Message } from "@klasa/core";
import { prisma } from "..";
import { sendErrorResponse, sendMessage, sendSuccessResponse } from "../utils/responses";
import { humanizeMilliseconds } from "../utils/transform";
import { ChannelType } from "@klasa/dapi-types";

export default class extends Command {
  constructor(store: CommandStore, directory: string, files: string[]) {
    super(store, directory, files, {
      aliases: ["remindme", "remindcreate", "rc", "reminder", "remindercreate"],
      runIn: [ChannelType.GuildText, ChannelType.GuildText],
      subcommands: true,
      usage: "<list|run:default> (time:duration) (interval:duration) (content:...string)",
    });

    this.createCustomResolver("time", (arg, _possible, message, [subcommand]) => {
      // When doing these subcommands, this arg is not required
      if (["list"].includes(subcommand.toLowerCase())) return arg;
      // Since this arg is required, and an arg was provided, validate it
      if (arg) return this.client.arguments.get("duration")?.run(arg, _possible, message);
      // This is a required arg and was not provided.
      throw message.language.get("REMIND_NEED_TIME");
    })
      .createCustomResolver("interval", (arg, _possible, message, [subcommand]) => {
        // When doing these subcommands, this arg is not required
        if (["list"].includes(subcommand.toLowerCase())) return arg;
        // An arg was provided, validate it
        if (arg) return this.client.arguments.get("duration")?.run(arg, _possible, message);
        // We don't necessarily need this argument so we can return it as empty
        return 0;
      })
      .createCustomResolver("content", (arg, _possible, message, [subcommand]) => {
        // When doing these subcommands, this arg is not required
        if (["list"].includes(subcommand.toLowerCase())) return arg;
        // Since this arg is required, and an arg was provided, validate it
        if (arg) return this.client.arguments.get("...string")?.run(arg, _possible, message);
        // This is a required arg and was not provided.
        throw message.language.get("REMIND_NEED_CONTENT");
      });
  }

  async run(message: Message, [time, interval, content]: [number, number, string]) {
    console.log("test types", time, interval, content);

    sendSuccessResponse(
      message.channel.id,
      message.language.get(interval ? "REMIND_CREATED" : "REMIND_RECURRING_CREATED")
    );

    await prisma.reminder.create({
      data: {
        reminderID: message.id,
        guildID: message.guild!.id,
        channelID: message.channel.id,
        userID: message.author.id,
        interval,
        content,
        timestamp: new Date(Date.now() + time),
      },
    });

    return message.responses;
  }

  async list(message: Message) {
    // Gets all reminders for this user.
    const reminders = await prisma.reminder.findMany({ where: { userID: message.author.id } });

    // if there are no reminders
    if (!reminders.length)
      return sendErrorResponse(
        message.channel.id,
        "There were no reminders found for you. To create a reminder, run this command without the `list` keyword."
      );

    // List out all the reminders
    return sendMessage(
      message.channel.id,
      {
        content: reminders
          .map(
            (reminder) =>
              `**${reminder.id}: ${humanizeMilliseconds(reminder.timestamp.getMilliseconds() - Date.now())}** => ${
                reminder.content
              }`
          )
          .join("\n"),
      },
      {
        char: "\n",
        maxLength: 2000,
      }
    );
  }
}
