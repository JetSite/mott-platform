import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";

import { getDatabaseInfo, getTableSchema } from "../../lib/strapi";
import { logger } from "../../utils/logger";
import ResultBuilder from "../../utils/result-builder";

const infoCommandCallback = async ({
  command,
  ack,
  respond,
  client,
  payload,
}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {
    await ack();
    await client.views.open({
      trigger_id: payload.trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Add documentation",
        },
        submit: {
          type: "plain_text",
          text: "Create",
        },
        close: {
          type: "plain_text",
          text: "Close",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "About the simplest modal you could conceive of :smile:\n\nMaybe <https://api.slack.com/reference/block-kit/block-elements|*make the modal interactive*> or <https://api.slack.com/surfaces/modals/using#modifying|*learn more advanced modal use cases*>.",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              action_id: "button-action",
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Psssst this modal was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>",
              },
            ],
          },
        ],
      },
    });
    if (command.text.startsWith("tables")) {
      logger.info("tables command");
      const tables = await getDatabaseInfo();
      await respond({
        text: `\`\`\`
        Your Tables: 
        --------------------
        ${tables.join("\n")}
        \`\`\``,
      });
    } else if (command.text.startsWith("schema")) {
      const table = command.text.split(" ")[1];
      logger.info(`schema command for ${table}`);
      try {
        const schema = await getTableSchema(table);
        if (schema === null) {
          await respond({
            text: `Table ${table} not found or there is no schema for it`,
          });
          return;
        }
        const result = ResultBuilder.buildFromRows(schema);
        await respond({
          text:
            `Table ${table} schema:\n` +
            `\`\`\`${result.slackTableContent}\`\`\``,
        });
      } catch (err: unknown) {
        logger.error(err);
        await respond({
          text: `Error while getting schema for ${table}, ${err instanceof Error ? err.message : "unknown error"}`,
        });
      }
    }
    await ack();
  } catch (err: unknown) {
    logger.error(err);
    await respond({
      text: `Error while executing command, ${err instanceof Error ? err.message : "unknown error"}`,
    });
  }
};

export default infoCommandCallback;
