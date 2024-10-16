import { App } from "@slack/bolt";
import { appMentionCallback } from "./app-mention";
import { messageCallback } from "./message";
import { ignoreMention } from "../../lib/utils";

const register = (app: App) => {
  app.event("app_mention", ignoreMention, appMentionCallback);
  app.event("message", ignoreMention, messageCallback);
};

export default { register };
