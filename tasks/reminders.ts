import { Task } from "klasa";
import { prisma } from "..";
import { isGuildTextBasedChannel, PermissionsFlags, Embed } from "@klasa/core";
import { fetchMember, displayAvatarURL } from "../utils/klasa";
import { sendMessage } from "../utils/responses";
import { calculateNextTimestamp } from "../utils/transform";

export default class extends Task {
  async run() {
    const reminders = await prisma.reminders.findMany({ where: { timestamp: { lte: new Date() } } });
    this.client.emit("debug", `[Task] Processing ${reminders.length} reminders!`);

    reminders.forEach(async (reminder) => {
      const channel = this.client.channels.get(reminder.channelID);
      if (!channel || !isGuildTextBasedChannel(channel)) return;

      const botMember = channel.guild.me;
      if (!botMember) return;

      const perms = channel.permissionsFor(botMember);
      if (
        ![PermissionsFlags.ViewChannel, PermissionsFlags.SendMessages, PermissionsFlags.EmbedLinks].every((perm) =>
          perms.has(perm)
        )
      )
        return;

      const member = await fetchMember(channel.guild, reminder.userID);
      // Member is not in the guild, remove the reminder
      if (!member?.user) return prisma.reminders.delete({ where: { id: reminder.id } });

      if (reminder.embedEnabled) {
        const embed = new Embed()
          .setAuthor(member.user.tag, displayAvatarURL(member.user))
          .setDescription(reminder.content)
          .setFooter(channel.guild.language.get("REMIND_ID", reminder.id));

        sendMessage(reminder.channelID, {
          embed,
          content: member.toString(),
          allowed_mentions: { parse: [], roles: [], users: [member.id] },
        });
      } else {
        sendMessage(reminder.channelID, {
          content: `${member.toString()}, ${reminder.content}`,
          allowed_mentions: { parse: [], roles: [], users: [member.id] },
        });
      }

      // If the reminder is not repeating, get rid of it
      if (!reminder.interval) return prisma.reminders.delete({ where: { id: reminder.id } });

      const newTimestamp = calculateNextTimestamp(reminder.interval, reminder.timestamp.getTime());
      return prisma.reminders.update({ where: { id: reminder.id }, data: { timestamp: new Date(newTimestamp) } });
    });
  }


}
