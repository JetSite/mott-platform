import type { Interaction } from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { TrainCommand } from "../commands/train-command";
import type { DiscordChatInputCommand } from "../types/DiscordChatInputCommand";

const globalChatInputCommandMap = new Map<string, DiscordChatInputCommand>();

function registerGlobalChatInputCommand(
  discordChatInputCommand: DiscordChatInputCommand,
): void {
  globalChatInputCommandMap.set(
    discordChatInputCommand.commandConfiguration.name,
    discordChatInputCommand,
  );
}
registerGlobalChatInputCommand(new TrainCommand());

export async function interactionModalListener(
  interaction: Interaction,
): Promise<void> {
  // Handle commands

  if (!interaction.isModalSubmit()) {
    return;
  }

  if (interaction.customId === "train") {
    const content = interaction.fields.getTextInputValue("content");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("improve_doc")
        .setLabel("Improve documentation")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("send_to_server")
        .setLabel("Add")
        .setStyle(ButtonStyle.Secondary),
    );

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New documentation")
      .setDescription(content);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
}
