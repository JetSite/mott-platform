import type { ChatInputCommandInteraction } from "discord.js";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { DiscordChatInputCommand } from "../types/DiscordChatInputCommand.js";

export class TrainCommand extends DiscordChatInputCommand {
  constructor() {
    super({
      name: "train",
      description: "",
    });
  }

  async handle(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId("train")
      .setTitle("Add Documentation");

    const content = new TextInputBuilder()
      .setCustomId("content")
      .setLabel("Content")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(content);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);
  }
}
