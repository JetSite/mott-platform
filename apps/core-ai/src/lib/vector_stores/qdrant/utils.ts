import { Document } from "@langchain/core/documents";
import { MixedbreadAIReranker } from "@langchain/mixedbread-ai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";

import { env } from "~/env";
import { openAIEmbeddings } from "../../clients/embeddings";

const client = new QdrantClient({
  url: env.QDRANT_URL,
  apiKey: env.QDRANT_API_KEY,
});
export async function similaritySearch(query: string, collectionName: string) {
  const reranker = new MixedbreadAIReranker({
    apiKey: env.MXBAI_API_KEY,
    topK: 3,
    returnInput: false,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    openAIEmbeddings,
    {
      url: env.QDRANT_URL,
      collectionName,
    }
  );

  const response = await vectorStore.similaritySearch(query, 10);
  const documents = response.map((item) => ({
    pageContent: item.pageContent,
    metadata: {},
  }));
  if (documents.length === 0) {
    return [];
  }
  const result = await reranker.compressDocuments(documents, query);
  return result;
}

export async function addDocument(
  content: string,
  type: string,
  metadata: Record<string, string>
) {
  const docs = [
    new Document({
      pageContent: content,
      metadata: metadata,
      id: metadata.strapi_uid,
    }),
  ];
  await QdrantVectorStore.fromDocuments(docs, openAIEmbeddings, {
    url: env.QDRANT_URL,
    collectionName: type,
  });
}

export async function deletePoint(collectionName: string, uid: string) {
  const data = {
    filter: {
      must: [
        {
          key: "metadata.strapi_uid",
          match: {
            value: uid,
          },
        },
      ],
    },
  };
  await client.delete(collectionName, data);
}
