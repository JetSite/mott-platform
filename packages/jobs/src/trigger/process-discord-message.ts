import { logger, task } from "@trigger.dev/sdk/v3";
import axios from "axios";

export const processDiscordMessageTask = task({
  id: "process-discord-message",
  maxDuration: 300, // 5 minutes
  run: async (
    payload: {
      prompt: string;
      authorId: string;
      discordId: string;
      discordName: string;
      discordLogin: string;
      messageId: string;
      channelId: string;
    },
    { ctx },
  ) => {
    logger.log("Sending request to server", { payload, ctx });

    try {
      const response = await axios.post(
        `${process.env.STRAPI_URL}/api/mott-ai`,
        {
          message: payload.prompt,
          authorId: payload.authorId,
          discordId: payload.discordId,
          discordName: payload.discordName,
          discordLogin: payload.discordLogin,
          messageId: payload.messageId,
          channelId: payload.channelId,
          type: "discord",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          },
        },
      );

      logger.log("Response received", { response: response.data });

      return {
        message: response.data,
      };
    } catch (error) {
      logger.error("Error sending request", { error });
      throw error;
    }
  },
});
