import { OpenAIEmbeddings } from "@langchain/openai";

export const openAIEmbeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-large",
});
