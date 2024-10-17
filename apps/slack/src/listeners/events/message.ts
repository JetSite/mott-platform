import type {
  AllMiddlewareArgs,
  GenericMessageEvent,
  SlackEventMiddlewareArgs,
} from "@slack/bolt";
import axios from "axios";

import { logger } from "../../utils/logger";

export async function messageCallback(
  args: AllMiddlewareArgs & SlackEventMiddlewareArgs<"message">,
): Promise<void> {
  const event = args.event as GenericMessageEvent;
  const { client } = args;

  if (event.text?.includes("<@")) {
    return;
  }
  // Ignore the event if the message contains a user mention
  if (event.channel_type !== "im" && !event.thread_ts) {
    return;
  }

  logger.info("message", event);
  const loadingMsg = await client.chat.postMessage({
    channel: event.channel,
    text: "Processing your request... ✨",
    thread_ts: event.thread_ts || event.ts,
  });
  const loadingMsgTs = loadingMsg.ts;

  try {
    const message = event.text?.replace(/<[^>]+>/g, "").trim();

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
      },
    );
    await client.chat.update({
      channel: event.channel,
      text: response.data,
      ts: loadingMsgTs ?? "",
    });
  } catch (err) {
    logger.error(err);
    await client.chat.update({
      channel: event.channel,
      text: "Sorry, I am unable to answer your question. Please try again later.",
      ts: loadingMsgTs ?? "",
    });
  }
}
