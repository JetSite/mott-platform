import { Client, IntentsBitField, Partials } from "discord.js";

import { env } from "~/env";

export async function sendDiscordMessage(
  userId: string,
  message: string,
): Promise<void> {
  try {
    const client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.User],
    });
    await client.login(env.DISCORD_BOT_TOKEN);

    const user = await client.users.fetch(userId);
    if (user) {
      await user.send(message);
      console.log(`Сообщение успешно отправлено пользователю ${userId}`);
    } else {
      console.error(`Пользователь с ID ${userId} не найден`);
    }
  } catch (error) {
    console.error(
      `Ошибка при отправке сообщения пользователю ${userId}:`,
      error,
    );
  }
}
