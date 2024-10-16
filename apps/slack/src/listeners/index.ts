import { App } from "@slack/bolt";
import events from "./events";
import commands from "./commands";
import shortcuts from "./shortcuts";
import actions from "./actions";
import views from "./views";

const registerListeners = (app: App) => {
  events.register(app);
  commands.register(app);
  shortcuts.register(app);
  actions.register(app);
  views.register(app);
};

export default registerListeners;
