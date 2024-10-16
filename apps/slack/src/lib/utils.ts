export const hasAccessToBot = (userId: string): boolean => {
  const allowedUsers = [
    "U07ASA4EXJQ",
    "U07AS75909J",
    "U062CJ1JPRR",
    "U06LQBFAB",
    "U01F08W1KFA",
    "U046B1E28PK",
    "U05QTAWBN3F",
    "U07BRB7797W",
  ];

  return allowedUsers.includes(userId);
};
interface IObjectAny {
  [key: string]: any;
}
export async function ignoreMention({
  message,
  event,
  next,
  client,
}: IObjectAny): Promise<void> {
  const disallowedSubtypes = ["channel_topic", "message_changed"];
  const ignoreSubtypeEvent = disallowedSubtypes.indexOf(event.subtype) > -1;
  const ignoreSubtypeMessage =
    message &&
    message.subtype &&
    disallowedSubtypes.indexOf(message.subtype) > -1;
  const ignoreEdited = !!event.edited;
  // If mention should be ignored, return
  if (ignoreSubtypeEvent || ignoreSubtypeMessage || ignoreEdited) {
    return;
  }
  if (!hasAccessToBot(event.user)) {
    await client.chat.postMessage({
      channel: event.channel,
      text: "Sorry, you don't have access to this bot's functionality.",
      thread_ts: event.thread_ts ?? event.ts,
    });
    return;
  }
  if (event.bot_id) {
    return;
  }

  // If mention should be processed, continue
  await next();
}
