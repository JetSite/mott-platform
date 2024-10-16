import {
  AllMiddlewareArgs,
  Block,
  InputBlock,
  KnownBlock,
  RichTextInput,
  RichTextText,
  SlackViewMiddlewareArgs,
} from "@slack/bolt";
import { addDocumentation } from "../../lib/strapi";

function extractInitialValue(
  blocks: (KnownBlock | Block)[],
  blockId: string
): string {
  for (const block of blocks) {
    if (block.type === "input" && block.block_id === blockId) {
      const richTextElements = ((block as InputBlock).element as RichTextInput)
        .initial_value?.elements;
      if (richTextElements && richTextElements.length > 0) {
        const textElements = richTextElements[0].elements;
        if (textElements && textElements.length > 0) {
          return (textElements[0] as RichTextText).text;
        }
      }
    }
  }

  return "";
}

const trainViewCallback = async ({
  ack,
  view,
}: AllMiddlewareArgs & SlackViewMiddlewareArgs) => {
  await ack();
  try {
    const { content_input_id, enhanced_content_input_id } = view.state.values;
    const content = (
      content_input_id["content-input"].rich_text_value?.elements[0]
        .elements[0] as RichTextText
    ).text;

    let enhancedContent =
      (
        enhanced_content_input_id["enhanced-content-input"].rich_text_value
          ?.elements[0].elements[0] as RichTextText
      )?.text ?? "";
    if (!enhancedContent) {
      enhancedContent = extractInitialValue(
        view.blocks,
        "enhanced_content_input_id"
      );
    }
    if (enhancedContent) {
      await addDocumentation(enhancedContent);
    } else {
      await addDocumentation(content);
    }
  } catch (error) {
    console.error(error);
  }
};

export default trainViewCallback;
