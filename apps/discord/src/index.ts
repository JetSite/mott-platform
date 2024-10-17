import type { ILogObj } from "tslog";
import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import * as dotenv from "dotenv";
import { Logger } from "tslog";

import { interactionButtonsListener } from "./listeners/interaction-buttons-listener";
import { interactionCreateListener } from "./listeners/interaction-create-listener";
import { interactionModalListener } from "./listeners/interaction-modal-listener";
import { messageCreateListener } from "./listeners/message-create-listener";
import { readyListener } from "./listeners/ready-listener";

dotenv.config();

export const log: Logger<ILogObj> = new Logger({
  minLevel: Number.parseInt(process.env.MIN_LOG_LEVEL || "3", 10), // 3 is info, 2 is debug
  hideLogPositionForProduction: true,
});

export const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
});

discordClient.on(Events.ClientReady, readyListener);
discordClient.on(Events.MessageCreate, messageCreateListener);
discordClient.on(Events.InteractionCreate, interactionCreateListener);
discordClient.on(Events.InteractionCreate, interactionModalListener);
discordClient.on(Events.InteractionCreate, interactionButtonsListener);

discordClient.login(process.env.BOT_TOKEN);
