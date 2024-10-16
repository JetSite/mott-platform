import {
  AllMiddlewareArgs,
  Block,
  BlockAction,
  KnownBlock,
  RichTextText,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { improveDocumentation } from "../../lib/strapi";

const enhanceTextActionCallback = async ({
  ack,
  client,
  body,
}: AllMiddlewareArgs & SlackActionMiddlewareArgs<BlockAction>) => {
  try {
    await ack();
    const textBlock = body.view?.state?.values["content_input_id"][
      "content-input"
    ].rich_text_value?.elements[0].elements[0] as RichTextText;
    const contentInput = textBlock.text;
    if (contentInput) {
      let improvedContent = "";
      let errorMessage = "";
      try {
        improvedContent = await improveDocumentation(contentInput);
      } catch (error) {
        errorMessage = "Failed to enhance the text. Please try again later.";
      }

      const blocks: (KnownBlock | Block)[] = [
        {
          type: "input",
          block_id: "content_input_id",
          element: {
            type: "rich_text_input",
            action_id: "content-input",
            initial_value: {
              type: "rich_text",
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: contentInput,
                    },
                  ],
                },
              ],
            },
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
          type: "input",
          optional: false,
          block_id: "enhanced_content_input_id",
          element: {
            type: "rich_text_input",
            action_id: "enhanced-content-input",
            initial_value: improvedContent
              ? {
                  type: "rich_text",
                  elements: [
                    {
                      type: "rich_text_section",
                      elements: [
                        {
                          type: "text",
                          text: improvedContent,
                        },
                      ],
                    },
                  ],
                }
              : undefined,
          },
          label: {
            type: "plain_text",
            text: "Enhanced Version",
            emoji: true,
          },
        },
      ];

      if (errorMessage) {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:warning: ${errorMessage}`,
          },
        });
      }

      await client.views.update({
        view_id: body.view!.id,
        hash: body.view!.hash,
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
          blocks: blocks,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default enhanceTextActionCallback;
