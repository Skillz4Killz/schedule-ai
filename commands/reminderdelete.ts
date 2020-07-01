import { Command, CommandStore } from "klasa";
import { Message } from "@klasa/core";
import { prisma } from "..";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responses";

export default class extends Command {
  constructor(store: CommandStore, directory: string, files: string[]) {
    super(store, directory, files, {
      aliases: ["rd"],
      usage: "<id:number>",
    });
  }

  async run(message: Message, [id]: [number]) {
    const reminder = await prisma.reminders.findOne({ where: { id }, select: { userID: true } });
    console.log(reminder?.userID, message.member?.guild.ownerID, message.author.id);
    // If the creator of the reminder is someone else they should not be deleted. Owners of a guild can however override and delete a reminder on their server.
    if (![reminder?.userID, message.member?.guild.ownerID].includes(message.author.id))
      return sendErrorResponse(message.channel.id, message.language.get("REMIND_OTHER_USER", id));

    if (!reminder) return sendErrorResponse(message.channel.id, message.language.get("REMIND_NOT_FOUND", id));

    sendSuccessResponse(message.channel.id, message.language.get("REMIND_DELETED", id));
    await prisma.reminders.delete({ where: { id, userID: message.author.id } });
    return message.responses;
  }
}
