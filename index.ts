import { KlasaClient } from "klasa";
import config from "./config";
import { Intents } from "@klasa/ws";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const client = new KlasaClient({
  commands: {
    prefix: ".",
    logging: true,
    editing: true,
    messageLifetime: 600000,
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
});

client.token = config.token;

client.connect();
