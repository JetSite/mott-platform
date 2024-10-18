import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { env } from "~/env";
import { addDocumentationToPrompt } from "../../ai/prompt-utils";
import { getRelatedDocumentation } from "../../ai/utils";
import { createLLM } from "../../clients/llm";
import BigQuerySource from "../../datasource/bigquery";
import { langfuse } from "../../langfuse/client";
import {
  EntityNameSqlTool,
  ListTablesSqlTool,
  QuerySqlTool,
  SchemaSqlTool,
  SqlQueryCheckerTool,
} from "../tools/bigquery-sql-tools";
import { retrieverTool } from "../tools/retriever-tools";
import { createAgent, runChatWithPrompt } from "../utils";

export default async function createBigQueryAgent(
  question: string,
  sessionId: string,
) {
  console.log("Creating bigquery agent", sessionId);
  const db = new BigQuerySource(
    env.CLIENT_BIGQUERY_CREDENTIALS,
    ["CRM", "META"],
    [
      "CRM.brands",
      "CRM.cities",
      "CRM.complaints",
      "CRM.designers",
      "CRM.item_state_activities",
      "CRM.managers",
      "CRM.order_items",
      "CRM.order_payments",
      "CRM.order_services",
      "CRM.orders",
      "CRM.product_categories",
      "CRM.product_rating_history",
      "CRM.products",
      "CRM.promocodes",
      "CRM.properties",
      "CRM.property_groups",
      "CRM.services",
      "CRM.state_activities",
      "CRM.sub_complaints",
      "CRM.supplier_stats",
      "CRM.suppliers",
      "META.yandex_metrika_log_visit_47929955",
    ],
  );
  const promptTranslatorTemplate = await langfuse.getPrompt(
    "question_translator",
  );

  const promptTranslator = promptTranslatorTemplate.getLangchainPrompt();
  const processedQuestion = await runChatWithPrompt(promptTranslator, {
    question,
  });

  const sqlExpertPrompt = await langfuse.getPrompt("bigquery-agent");

  let SQL_PREFIX = sqlExpertPrompt.getLangchainPrompt();

  const docList = await getRelatedDocumentation(processedQuestion);
  if (docList.length) {
    SQL_PREFIX = addDocumentationToPrompt(SQL_PREFIX, docList);
  }

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SQL_PREFIX],
    new MessagesPlaceholder("messages"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const tools = [
    retrieverTool,
    new EntityNameSqlTool(db),
    new SchemaSqlTool(db),
    new SqlQueryCheckerTool(createLLM() as unknown as BaseLanguageModel),
    new QuerySqlTool(db),
    new ListTablesSqlTool(db),
  ];
  const partialData: Record<string, string> = {
    dialect: "BigQuery SQL",
    top_k: "200",
    current_time: new Date().toISOString(),
  };

  const newPrompt = await prompt.partial(partialData);

  return createAgent(createLLM(), tools, newPrompt);
}
