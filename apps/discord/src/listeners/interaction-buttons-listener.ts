import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Interaction,
} from "discord.js";
import { TrainCommand } from "../commands/train-command";
import { DiscordChatInputCommand } from "../types/DiscordChatInputCommand";
import { addDocumentation, improveDocumentation } from "../lib/strapi";

const globalChatInputCommandMap = new Map<string, DiscordChatInputCommand>();

function registerGlobalChatInputCommand(
  discordChatInputCommand: DiscordChatInputCommand
): void {
  globalChatInputCommandMap.set(
    discordChatInputCommand.commandConfiguration.name,
    discordChatInputCommand
  );
}
registerGlobalChatInputCommand(new TrainCommand());

export async function interactionButtonsListener(
  interaction: Interaction
): Promise<void> {
  if (!interaction.isButton()) return;

  if (interaction.customId === "improve_doc") {
    await interaction.deferReply({ ephemeral: true });
    const improvedDoc = await improveDocumentation(
      interaction.message.embeds[0].description ?? ""
    );

    const improvedEmbed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Improved Documentation")
      .setDescription(
        improvedDoc.length > 4096
          ? improvedDoc.slice(0, 4093) + "..."
          : improvedDoc
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("send_to_server")
        .setLabel("Add")
        .setStyle(ButtonStyle.Primary)
    );
    await interaction.editReply({
      embeds: [improvedEmbed],
      components: [row],
    });
    return;
  }
  if (interaction.customId === "send_to_server") {
    await interaction.deferReply({ ephemeral: true });
    await addDocumentation(interaction.message.embeds[0].description ?? "");
    await interaction.editReply({
      content: "Documentation added to server",
    });
  }
}
