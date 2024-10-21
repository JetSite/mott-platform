import type { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";
import type { BaseRetrieverInterface } from "@langchain/core/retrievers";
import type { DynamicStructuredToolInput } from "@langchain/core/tools";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import type { Tool } from "langchain/tools";
import { z } from "zod";

import { env } from "~/env";

function createRetrieverTool(
  retriever: BaseRetrieverInterface,
  input: Omit<DynamicStructuredToolInput, "func" | "schema">,
) {
  const func = async (
    { query }: { query: string },
    runManager?: CallbackManagerForToolRun,
  ) => {
    const docs = await retriever.getRelevantDocuments(
      query,
      runManager?.getChild("retriever"),
    );
    return docs
      .map((doc) => {
        const { id, ...metadata } = doc.metadata;
        return `${doc.pageContent} ${JSON.stringify(metadata)}`;
      })
      .join("\n\n");
  };
  const schema = z.object({
    query: z.string().describe("query to look up in retriever"),
  });
  return new DynamicStructuredTool({ ...input, func, schema });
}

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-large" });

const vectorStore = new QdrantVectorStore(embeddings, {
  url: env.QDRANT_URL,
  collectionName: "proper_nouns",
});

const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    fetchK: 3,
    lambda: 0.1,
  },
});

const description = `Use to look up values to filter on.
  Input is an approximate spelling of the proper noun, output is valid proper nouns with metadata.
  Use the noun most similar to the search.`;

export const retrieverTool = createRetrieverTool(retriever, {
  description,
  name: "search_proper_nouns",
}) as unknown as Tool;
