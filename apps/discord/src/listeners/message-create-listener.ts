import axios from "axios";
import { Message } from "discord.js";
import { discordClient } from "..";

export async function messageCreateListener(message: Message) {
  try {
    if (message.author.bot) return;

    if (!message.guild || message.mentions.has(discordClient.user!.id)) {
      const prompt = message.content
        .replace(`<@${discordClient.user!.id}>`, "")
        .trim();
      let response;
      const processingMessage = await message.reply(
        "Please hold on, your request is being diligently processed by Mott..."
      );
      const typingInterval = setInterval(
        () => message.channel.sendTyping(),
        5000
      );

      try {
        response = await axios.post(
          `${process.env.BACKEND_URL}/api/mott-ai`,
          {
            message: prompt,
            authorId: message.author.id,
            discordId: message.author.id,
            discordName: message.author.tag,
            discordLogin: `${message.author.username}#${message.author.discriminator}`,
            messageId: message.id,
            channelId: message.channelId,
            type: "discord",
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.API_TOKEN}`,
            },
          }
        );
        await processingMessage.delete();

        const messageToUser = response.data;
        message.reply(messageToUser);
      } catch (err) {
        await processingMessage.delete();
        message.reply("Oops! Something went wrong. Please try again");
        console.log("err", JSON.stringify(err));
      } finally {
        clearInterval(typingInterval);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
