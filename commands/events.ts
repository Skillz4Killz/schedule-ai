import { Message, Embed } from "@klasa/core";
import { Command } from "klasa";
import { prisma } from "..";
import { ChannelType } from "@klasa/dapi-types";
import { sendErrorResponse, sendMessage } from "../utils/responses";
import { Event } from "@prisma/client";
import { humanizeMilliseconds } from "../utils/transform";
import { displayAvatarURL } from "../utils/klasa";

export default class extends Command {
  aliases = ["e"];
  runIn = [ChannelType.GuildText, ChannelType.GuildNews];

  async run(message: Message) {
    // Guild ID will be available from the `runIn` prop
    const events = await prisma.event.findMany({ where: { guildID: message.guild?.id } });

    // If there are no events available
    if (!events.length)
      return sendErrorResponse(
        message.channel.id,
        "There are no events currently on this server. To create an event, use the eventcreate command."
      );

    this.sendEventList(message, events);
    return message.responses;
  }

  sendEventList(message: Message, events: Event[]) {
    const embed = new Embed().setAuthor(message.author.tag, displayAvatarURL(message.author));

		// Splice will remove from the events array
		embed.setDescription(this.listEvents(events.splice(0, 12)));
		// Sends the message to the user
		sendMessage(message.channel.id, { embed })

		// If anything is left, it will rerun with remaining events
		if (events.length) this.sendEventList(message, events)
  }

  listEvents(events: Event[]) {
    const now = Date.now();
    const sortedEvents = events.sort((a, b) => a.id - b.id).slice(0, 12);

    return sortedEvents
      .map((event) => {
        let textString = `**[${event.eventID}] `;

        if (event.isRecurring) textString += ` 🔁 (${humanizeMilliseconds(event.frequency)}) `;

        textString += `${event.title}**\n`;
        textString += `<:dotgreen:441301429555036160>\`[${event.attendeeIDs.length} / ${event.maxAttendees}]\`<:dotyellow:441301443337781248>\`[${event.waitingListIDs.length}]\`<:dotred:441301715493584896>\`[${event.denialIDs.length}]\` `;

        const start = event.startTimestamp.getMilliseconds();
        const end = event.endTimestamp.getMilliseconds();

        if (start > now) {
          textString += `starts in \`${humanizeMilliseconds(start - now)}\``;
        } else if (end > now) {
          textString += `ends in \`${humanizeMilliseconds(end - now)}\``;
        } else {
          textString += `ended \`${humanizeMilliseconds(now - end)}\` ago.`;
        }

        return textString;
      })
      .join("\n");
  }
}
