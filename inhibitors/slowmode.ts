import { Inhibitor, InhibitorStore } from "klasa";
import { RateLimitManager } from "@klasa/ratelimits";

import type { Message } from "@klasa/core";
import { delayedDelete } from "../utils/klasa";

export default class extends Inhibitor {
  private readonly slowmode: RateLimitManager;
  private readonly aggressive: boolean;

  constructor(store: InhibitorStore, directory: string, files: readonly string[]) {
    super(store, directory, files, { spamProtection: true });
    this.slowmode = new RateLimitManager(this.client.options.commands.slowmode);
    this.aggressive = this.client.options.commands.slowmodeAggressive;

    if (!this.client.options.commands.slowmode) this.disable();
  }

  public run(message: Message): void {
    if (this.client.owners.has(message.author)) return;

    const rateLimit = this.slowmode.acquire(message.author.id);

    try {
      rateLimit.consume();
    } catch (err) {
      if (this.aggressive) rateLimit.resetTime();
      // Delete the message to prevent spam commands from cloggin a channel
      delayedDelete(message, 2, message.language.get("SLOWMODE_SPAM_CLEAR", message.author.tag));
      throw true;
    }
  }
}
