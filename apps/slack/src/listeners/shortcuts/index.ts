import type { App } from "@slack/bolt";

import sampleShortcutCallback from "./sample-shortcut";
import trainShortcutCallback from "./train-shortcut";

const register = (app: App) => {
  app.shortcut("sample_shortcut_id", sampleShortcutCallback);
  app.shortcut("train_shortcut_id", trainShortcutCallback);
};

export default { register };
