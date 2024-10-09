import { Client } from "discord.js";
import { log } from "..";
import { registerCommandsOnDiscord } from "../commands/register";

export async function readyListener(clientObject: Client<true>): Promise<void> {
  log.info(`Logged in as ${clientObject.user.tag} (${clientObject.user.id}).`);
  await registerCommandsOnDiscord(clientObject);
  log.info("Registering commands on Discord.");
}
