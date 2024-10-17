import type { App } from "@slack/bolt";

import actions from "./actions";
import commands from "./commands";
import events from "./events";
import shortcuts from "./shortcuts";
import views from "./views";

const registerListeners = (app: App) => {
  events.register(app);
  commands.register(app);
  shortcuts.register(app);
  actions.register(app);
  views.register(app);
};

export default registerListeners;
