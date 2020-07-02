export function humanizeMilliseconds(value: number) {
  // Gets ms into seconds
  const time = value / 1000;

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor(((time % 86400) % 3600) / 60);
  const seconds = Math.floor(((time % 86400) % 3600) % 60);

  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${dayString}${hourString}${minuteString}${secondString}`;
}

export function calculateNextTimestamp(interval: number, timestamp: number, now = Date.now()) {
  if (timestamp < now) {
    const multiple = Math.floor((now - timestamp) / interval);
    if (multiple > 0) timestamp = timestamp + interval * multiple;

    if (timestamp < now) return timestamp + interval;
    return timestamp;
  }
  return timestamp;
}

export const shortenString = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length - 3) + "..." : text;
};