import { App } from "@slack/bolt";
import infoCommandCallback from "./info-command";

const register = (app: App) => {
  app.command("/info", infoCommandCallback);
};

export default { register };
