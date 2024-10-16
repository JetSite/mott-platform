import { App } from "@slack/bolt";
import trainViewCallback from "./train-view";

const register = (app: App) => {
  app.view("train_view_id", trainViewCallback);
};

export default { register };
