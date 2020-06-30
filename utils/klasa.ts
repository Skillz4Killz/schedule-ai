import { User, Guild, Message,  } from "@klasa/core";

export function randomColor() {
  return Math.floor(Math.random() * (0xffffff + 1));
}

export function displayAvatarURL(user: User) {
  return user.avatar
    ? user.client.api.cdn.userAvatar(user.id, user.avatar)
    : user.client.api.cdn.defaultAvatar(Number(user.discriminator));
}

export function fetchMember(guild: Guild, userID: string) {
  const cachedMember = guild.members.get(userID)
  if (cachedMember) return cachedMember

  return guild.members.fetch(userID).catch(() => undefined)
}

export function delayedDelete(message: Message, delay = 10, reason?: string) {
  if (!message.deletable || message.deleted) return
  
}
