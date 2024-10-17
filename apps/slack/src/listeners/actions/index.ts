import type { App } from "@slack/bolt";

import enhanceTextActionCallback from "./enhance-text-action";
import sampleActionCallback from "./sample-action";

const register = (app: App) => {
  app.action("sample_action_id", sampleActionCallback);
  app.action("enhance-text-action", enhanceTextActionCallback);
};

export default { register };
