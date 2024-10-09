import {
  ApplicationCommandType,
  Client,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export async function generateRegisterCommandsBody(): Promise<
  RESTPostAPIApplicationCommandsJSONBody[]
> {
  const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];

  globalCommands.push({
    name: "train",
    description: `Train description`,
    type: ApplicationCommandType.ChatInput,
  });

  return globalCommands;
}

export async function registerCommandsOnDiscord(client: Client<true>) {
  const globalCommands = await generateRegisterCommandsBody();
  await client.application.commands.set(globalCommands);
}
