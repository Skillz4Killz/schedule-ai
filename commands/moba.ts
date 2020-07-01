import { Command, CommandStore } from "klasa";
import { Message } from "@klasa/core";
import { hasCreateEventRole, qnaSession } from "../utils/events";
import { sendErrorResponse } from "../utils/responses";

export interface QuestionData {
  name: string;
  title: string;
  description: string;
  footer?: string;
}

const data: QuestionData[] = [
  { name: "title", title: "EVENT_CREATE_TITLE", description: "EVENT_CREATE_DESC", footer: "FOOTER_QUIT" },
  { name: "description", title: "EVENT_DESCRIPTION_TITLE", description: "EVENT_DESCRIPTION_DESC" },
];

export default class extends Command {
  constructor(store: CommandStore, directory: string, files: string[]) {
    super(store, directory, files, {
      usage: "[templateName:...string]",
    });
  }

  async run(message: Message, [templateName]: [string | undefined]) {
    // Check if this user can create events on this server first
    const hasRoleCreatePermission = await hasCreateEventRole(message);
    if (!hasRoleCreatePermission) return message.responses;

    // TODO: create the event based on this template
    if (templateName) {
      return message.responses;
    }

    // No template was provided so a new event should be created.
    const answers = await qnaSession(message, data);
    if (!answers.length) return sendErrorResponse(message.channel.id, message.language.get('CANCELLED_EVENT_CREATION'))

    // TODO: create the event based on the responses
    console.log(answers)

    return message.responses;
  }
}
