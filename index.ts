import { KlasaClient } from "klasa";
import config from "./config";
import { Intents } from "@klasa/ws";
import { PrismaClient } from "@prisma/client";
import { ChannelType } from "@klasa/dapi-types";

export const prisma = new PrismaClient();

export const client = new KlasaClient({
  commands: {
    prefix: ".",
    logging: true,
    editing: true,
    messageLifetime: 600000,
    slowmode: 2000,
    slowmodeAggressive: true
  },
  rest: {
    offset: 0,
  },
  consoleEvents: {
    debug: true,
  },
  cache: {
    messageLifetime: 300000,
    messageSweepInterval: 60000,
  },
  ws: {
    intents: Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILDS,
  },
  pieces: {
    defaults: {
      commands: {
        usageDelim: " ",
        promptLimit: Infinity,
        runIn: [ChannelType.GuildNews, ChannelType.GuildText],
      },
    },
  },
});

client.token = config.token;

client.connect();
