import axios from "axios";
import { logger } from "../../utils/logger";
import { AllMiddlewareArgs, SlackEventMiddlewareArgs } from "@slack/bolt";

export async function appMentionCallback({
  event,
  client,
}: AllMiddlewareArgs & SlackEventMiddlewareArgs<"app_mention">): Promise<void> {
  logger.info("event mention", event);
  const loadingMsg = await client.chat.postMessage({
    channel: event.channel,
    text: "Processing your request... ✨",
  });
  const loadingMsgTs = loadingMsg.ts;
  try {
    const message = event.text.replace(/<[^>]+>/g, "").trim();

    const data = {
      message,
      authorId: event.user,
      discordId: event.user,
      messageId: event.client_msg_id,
      channelId: event.channel,
      type: "slack",
    };
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/mott-ai`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );
    await client.chat.update({
      channel: event.channel,
      text: response.data,
      ts: loadingMsgTs!,
    });
  } catch (err: any) {
    logger.error(err);
    await client.chat.update({
      channel: event.channel,
      text: "Sorry, I am unable to answer your question. Please try again later.",
      ts: loadingMsgTs!,
    });
  }
}
