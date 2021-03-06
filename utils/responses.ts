import { MessageData, SplitOptions, isTextBasedChannel } from "@klasa/core";
import { client } from "../index";
import { shortenString } from './transform';

export async function sendMessage(channelID: string, data: MessageData, options?: SplitOptions) {
  const channel = client.channels.get(channelID);
  if (!channel || !isTextBasedChannel(channel)) return [];

  return channel.send({ data }, options);
}

export function sendErrorResponse(channelID: string, text: string) {
  return sendMessage(channelID, {
    content: `❌ ${text}`.substring(0, 2000),
  });
}

export function sendSuccessResponse(channelID: string, text: string) {
  return sendMessage(channelID, { content: shortenString(`<a:success:664865672559591439> ${text}`, 2000) });
}
