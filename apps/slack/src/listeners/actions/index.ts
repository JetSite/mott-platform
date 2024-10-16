import { App } from "@slack/bolt";
import sampleActionCallback from "./sample-action";
import enhanceTextActionCallback from "./enhance-text-action";

const register = (app: App) => {
  app.action("sample_action_id", sampleActionCallback);
  app.action("enhance-text-action", enhanceTextActionCallback);
};

export default { register };
