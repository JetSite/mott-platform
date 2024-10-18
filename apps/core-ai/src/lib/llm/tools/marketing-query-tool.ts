import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const marketingQuerySchema = z.object({
  percentageOfConfidence: z
    .string()
    .describe(
      "The parameter contains the percentage of confidence that the request is related to marketing or analytical information."
    ),
});
export const marketingQueryTool = new DynamicStructuredTool({
  name: "determine_marketing_relevance",
  description:
    "This function is called to determine if the request is related to marketing information, business intelligence, or analytics. The percentageOfConfidence parameter reflects the confidence percentage that the request pertains to these areas.",
  schema: marketingQuerySchema,
  func: async ({ percentageOfConfidence }) => {
    console.log("percentageOfConfidence", percentageOfConfidence);
    return `This function is not implemented yet. Confidence: ${percentageOfConfidence}`;
  },
});
