import type { App } from "@slack/bolt";

import { ignoreMention } from "../../lib/utils";
import { appMentionCallback } from "./app-mention";
import { messageCallback } from "./message";

const register = (app: App) => {
  app.event("app_mention", ignoreMention, appMentionCallback);
  app.event("message", ignoreMention, messageCallback);
};

export default { register };
