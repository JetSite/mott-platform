import { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from "@slack/bolt";

const trainShortcutCallback = async ({
  ack,
  client,
  payload,
  respond,
}: AllMiddlewareArgs & SlackShortcutMiddlewareArgs) => {
  try {
    await ack();
    await client.views.open({
      trigger_id: payload.trigger_id,
      view: {
        callback_id: "train_view_id",
        type: "modal",
        title: {
          type: "plain_text",
          text: "Add Documentation",
          emoji: true,
        },
        submit: {
          type: "plain_text",
          text: "Add",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
        blocks: [
          {
            type: "input",
            block_id: "content_input_id",
            element: {
              type: "rich_text_input",
              action_id: "content-input",
            },
            label: {
              type: "plain_text",
              text: "Content",
              emoji: true,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Enhance Text",
                  emoji: true,
                },
                value: "enhance_text",
                action_id: "enhance-text-action",
              },
            ],
          },
          {
            optional: false,
            type: "input",
            block_id: "enhanced_content_input_id",
            element: {
              type: "rich_text_input",
              action_id: "enhanced-content-input",
            },
            label: {
              type: "plain_text",
              text: "Enhanced Version",
              emoji: true,
            },
          },
        ],
      },
    });
  } catch (error: any) {
    await respond({
      text: `Error while executing command, ${error.message}}`,
    });
  }
};

export default trainShortcutCallback;
