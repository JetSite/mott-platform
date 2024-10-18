import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { InputValues } from "@langchain/core/utils/types";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import pg from "pg";

import { env } from "~/env";
import { getLastQuerySqlInput } from "../ai/parsers";
import { createLLM } from "../clients/llm";
import { createCallbackHandler } from "../langfuse/client";
import createBigQueryAgent from "./agents/bigquery-agent";
import { createSqlAgent } from "./agents/postgres-sql-agent";

export async function getMessageFromAI(request: string): Promise<string> {
  const messages = [new HumanMessage(request)];
  const parser = new StringOutputParser();
  const result = await createLLM().invoke(messages);
  return await parser.invoke(result);
}

export async function runChatWithPrompt(
  request: string,
  values: InputValues,
): Promise<string> {
  const parser = new StringOutputParser();
  const promptTemplate = PromptTemplate.fromTemplate(request);
  const promptTemplateInvoked = await promptTemplate.invoke(values);
  const result = await createLLM().invoke(promptTemplateInvoked);
  return await parser.invoke(result);
}

export async function createAgent(
  llm: any,
  tools: any[],
  prompt: ChatPromptTemplate,
) {
  const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
  return new AgentExecutor({
    agent,
    tools,
    maxIterations: 15,
    returnIntermediateSteps: true,
  });
}

async function getLastTenMessages(sessionId: string) {
  const databaseConfig = {
    host: env.CHAT_HISTORY_DB_HOST,
    port: env.CHAT_HISTORY_DB_PORT,
    user: env.CHAT_HISTORY_DB_USER,
    password: env.CHAT_HISTORY_DB_PASSWORD,
    database: env.CHAT_HISTORY_DB_NAME,
  };
  pg.types.setTypeParser(pg.types.builtins.JSON, JSON.parse);
  pg.types.setTypeParser(pg.types.builtins.JSONB, JSON.parse);
  const databasePool = new pg.Pool(databaseConfig);

  const chatHistory = new PostgresChatMessageHistory({
    sessionId,
    pool: databasePool,
  });

  const messages = await chatHistory.getMessages();
  await databasePool.end();

  return messages.slice(-10);
}

export async function runChatWithSqlAgent(question: string, userId: string) {
  const databaseConfig = {
    host: env.CHAT_HISTORY_DB_HOST,
    port: env.CHAT_HISTORY_DB_PORT,
    user: env.CHAT_HISTORY_DB_USER,
    password: env.CHAT_HISTORY_DB_PASSWORD,
    database: env.CHAT_HISTORY_DB_NAME,
  };
  pg.types.setTypeParser(pg.types.builtins.JSON, JSON.parse);
  pg.types.setTypeParser(pg.types.builtins.JSONB, JSON.parse);
  const databasePool = new pg.Pool(databaseConfig);

  const uniqueSessionId = `${new Date().toISOString().split("T")[0]}-${userId}`;
  const chatHistory = new PostgresChatMessageHistory({
    sessionId: uniqueSessionId,
    pool: databasePool,
  });
  chatHistory.addUserMessage(question);
  let sqlExpertAssistant = null;
  if (env.AGENT_TYPE === "BIGQUERY") {
    sqlExpertAssistant = await createBigQueryAgent(question, uniqueSessionId);
  } else {
    sqlExpertAssistant = await createSqlAgent(question, uniqueSessionId);
  }

  const lastTenMessages = await getLastTenMessages(uniqueSessionId);
  const userInputMessage = new HumanMessage({
    content: question,
  });
  const agentInput = {
    messages: [...lastTenMessages, userInputMessage],
  };

  const agentResponse = await sqlExpertAssistant.invoke(agentInput, {
    configurable: { sessionId: uniqueSessionId },
    callbacks: [createCallbackHandler({ sessionId: uniqueSessionId, userId })],
  });

  const lastExecutedSqlQuery = getLastQuerySqlInput(agentResponse);
  let formattedOutput = agentResponse.output;
  if (lastExecutedSqlQuery) {
    formattedOutput =
      "```sql\n " + lastExecutedSqlQuery + "\n```\n " + formattedOutput;
  }
  chatHistory.addAIMessage(formattedOutput);
  return formattedOutput || "No answer from AI.";
}
