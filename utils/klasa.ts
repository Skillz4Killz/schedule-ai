import { User } from "@klasa/core";

export function randomColor() {
  return Math.floor(Math.random() * (0xffffff + 1));
}

export function displayAvatarURL(user: User) {
  return user.avatar
    ? user.client.api.cdn.userAvatar(user.id, user.avatar)
    : user.client.api.cdn.defaultAvatar(Number(user.discriminator));
}
