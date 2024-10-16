import { App } from "@slack/bolt";
import { config } from "dotenv";
import registerListeners from "./listeners";
import { logLevel, logger } from "./utils/logger";

config();
/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel,
  logger,
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(Number(process.env.PORT) || 3000);
    // The open_modal shortcut opens a plain old modal

    console.log("⚡️ Bolt app is running! ⚡️");
  } catch (error) {
    console.error("Unable to start App", error);
  }
})();
