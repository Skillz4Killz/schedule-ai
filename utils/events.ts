import { Message, PermissionsFlags, Embed } from "@klasa/core";
import { prisma } from "..";
import { QuestionData } from "../commands/moba";
import { sendMessage } from "./responses";
import { displayAvatarURL, randomColor, delayedDelete } from "./klasa";

export async function hasCreateEventRole(message: Message) {
  // This should only be running in a guild
  if (!message.guild || !message.member) return false;

  // If the member is an admin it should be allowed no matter what.
  if (message.member.permissions.has(PermissionsFlags.Administrator)) return true;

  // Fetch the guild settings
  const settings = await prisma.guilds.findOne({
    where: { guildID: message.guild.id },
    select: { createRoleIDs: true },
  });
  // If the settings don't exist there is no role therefore only admins could be able to create
  if (!settings) return false;

  // If the user has any of the ids that can create an event then allow it
  return settings.createRoleIDs.some((id) => message.member?.roles.has(id));
}

export async function qnaSession(message: Message, data: QuestionData[]) {
  // Create the base embed
  const questionEmbed = new Embed().setAuthor(message.author.tag, displayAvatarURL(message.author));
  // Send a placeholder message which will ask the questions
  let [questionMessage] = await sendMessage(message.channel.id, { embed: questionEmbed });

  const answers: { content: string; name: string }[] = [];
  const QUIT = message.language.get("QUIT");

  for (const item of data) {
    // Update embed with latest response
    if (item.description) questionEmbed.setDescription(item.description);
    if (item.title) questionEmbed.setTitle(item.title);
    if (item.footer) questionEmbed.setFooter(item.footer);
    questionEmbed.setColor(randomColor());
    // Edit the message so use can see the new question
    questionMessage.edit({ data: { embed: questionEmbed } });

    // Wait for a response
    const responses = await message.channel.awaitMessages({
      // Only want 1 response
      limit: 1,
      // Wait 5 minutes for a response
      idle: 300000,
      // Only a message with some text and it sent by the author should be accepted.
      filter: ([msg]) => msg.content.length > 0 && msg.author.id === message.author.id,
    });

    const response = responses.firstValue;
    // If there was no message or user asked to quit break the loop and cancel out
    if (!response?.content || response.content.toLowerCase() === QUIT.toLowerCase()) return [];
    // Deletes the response after 3 seconds to keep channel clean and the question embed visible
    delayedDelete(response, 3, message.language.get("QNA_SPAM_CLEAN", message.author.tag));

    answers.push({ content: response.content, name: item.name });
  }

  return answers;
}
