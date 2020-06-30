import { User, Guild, Message } from "@klasa/core";
import { sleep } from "@klasa/utils";

export function randomColor() {
  return Math.floor(Math.random() * (0xffffff + 1));
}

export function displayAvatarURL(user: User) {
  return user.avatar
    ? user.client.api.cdn.userAvatar(user.id, user.avatar)
    : user.client.api.cdn.defaultAvatar(Number(user.discriminator));
}

export function fetchMember(guild: Guild, userID: string) {
  const cachedMember = guild.members.get(userID);
  if (cachedMember) return cachedMember;

  return guild.members.fetch(userID).catch(() => undefined);
}

export function delayedDelete(message: Message, delay = 10, reason?: string) {
  // If not deleteable or already deleted we dont need to sleep
  if (!message.deletable || message.deleted) return;

  // Sleep for the duration then try deleting again
  sleep(delay * 1000).then(() => {
    // Incase another user/bot has deleted the message while sleeping
    if (!message.deletable || message.deleted) return;
    // Incase some error happens. Message.delete is funky at best
    message.delete({ reason }).catch(() => undefined);
  });
}
