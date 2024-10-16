import { App } from "@slack/bolt";
import { config } from "dotenv";
import registerListeners from "./listeners";
import { logLevel, logger } from "./utils/logger";
import {
  addSlackInstallation,
  deleteSlackInstallation,
  getSlackInstallation,
} from "./lib/strapi";

config();

const app = new App({
  logLevel,
  logger,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  scopes: [
    "channels:history",
    "chat:write",
    "commands",
    "app_mentions:read",
    "im:history",
    "files:write",
    "files:read",
  ],
  redirectUri: process.env.SLACK_REDIRECT_URI,
  installationStore: {
    storeInstallation: async (installation) => {
      // Org-wide installation
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        await addSlackInstallation(installation.enterprise.id, installation);
        return;
      }
      // Single team installation
      if (installation.team !== undefined) {
        await addSlackInstallation(installation.team.id, installation);
        return;
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      // Org-wide installation lookup
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        return getSlackInstallation(installQuery.enterpriseId);
      }
      // Single team installation lookup
      if (installQuery.teamId !== undefined) {
        return getSlackInstallation(installQuery.teamId);
      }
    },
    deleteInstallation: async (installQuery) => {
      // Org-wide installation deletion
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        await deleteSlackInstallation(installQuery.enterpriseId);
        return;
      }
      // Single team installation deletion
      if (installQuery.teamId !== undefined) {
        await deleteSlackInstallation(installQuery.teamId);
        return;
      }
      throw new Error("Failed to delete installation");
    },
  },
  installerOptions: {
    redirectUriPath: "/slack/oauth_redirect",
    directInstall: false,
    stateVerification: false,
  },
});
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(Number(process.env.PORT) || 3000);
    console.log("⚡️ Bolt app is running! ⚡️");
  } catch (error) {
    console.error("Unable to start App", error);
  }
})();
