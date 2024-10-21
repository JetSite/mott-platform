import type { BaseLanguageModel } from "@langchain/core/language_models/base";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { SqlDatabase } from "langchain/sql_db";
import { InfoSqlTool, QueryCheckerTool } from "langchain/tools/sql";
import { DataSource } from "typeorm";

import { env } from "~/env";
import {
  addDocumentationToPrompt,
  addInstructionsToPrompt,
  addSQLToPrompt,
} from "../../ai/prompt-utils";
import {
  getRelatedDocumentation,
  getRelatedQuestion,
  getSimilarQuestionSql,
} from "../../ai/utils";
import { createLLM } from "../../clients/llm";
import { langfuse } from "../../langfuse/client";
import {
  EntityNameSqlTool,
  SchemaSqlTool,
  SqlQueryCheckerTool,
} from "../tools/postgres-sql-tools";
import { retrieverTool } from "../tools/retriever-tools";
import { createAgent, runChatWithPrompt } from "../utils";

export async function createSqlAgent(question: string, sessionId: string) {
  const dataSource = new DataSource({
    type: "postgres",
    host: env.CLIENT_POSTGRES_HOST,
    port: Number(env.CLIENT_POSTGRES_PORT) || 5432,
    username: env.CLIENT_POSTGRES_USER,
    password: env.CLIENT_POSTGRES_PASSWORD,
    database: env.CLIENT_POSTGRES_DB,
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: dataSource,
    sampleRowsInTableInfo: 2,
  });

  const promptTranslatorTemplate = await langfuse.getPrompt(
    "question_translator",
  );

  const promptTranslator = promptTranslatorTemplate.getLangchainPrompt();
  const processedQuestion = await runChatWithPrompt(promptTranslator, {
    question,
  });

  const sqlExpertPrompt = await langfuse.getPrompt("sql-agent");

  let SQL_PREFIX = sqlExpertPrompt.getLangchainPrompt();

  const docList = await getRelatedDocumentation(processedQuestion);
  if (docList.length) {
    SQL_PREFIX = addDocumentationToPrompt(SQL_PREFIX, docList);
  }
  const questionList = await getRelatedQuestion(processedQuestion);
  if (questionList.length) {
    SQL_PREFIX = addInstructionsToPrompt(SQL_PREFIX, questionList);
  }
  const sqlList = await getSimilarQuestionSql(processedQuestion);
  if (sqlList.length) {
    SQL_PREFIX = addSQLToPrompt(SQL_PREFIX, sqlList);
  }
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SQL_PREFIX],
    new MessagesPlaceholder("messages"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);
  const sqlToolKit = new SqlToolkit(
    db,
    createLLM() as unknown as BaseLanguageModel,
  );

  const tools = [
    ...sqlToolKit
      .getTools()
      .filter(
        (tool) =>
          !(tool instanceof InfoSqlTool || tool instanceof QueryCheckerTool),
      ),
    retrieverTool,
    new EntityNameSqlTool(db),
    new SchemaSqlTool(db),
    new SqlQueryCheckerTool(createLLM() as unknown as BaseLanguageModel),
  ];
  const partialData: Record<string, string> = {
    dialect: "PostgreSQL",
    top_k: "50",
    current_time: new Date().toISOString(),
  };

  const newPrompt = await prompt.partial(partialData);

  return createAgent(createLLM(), tools, newPrompt);
}
