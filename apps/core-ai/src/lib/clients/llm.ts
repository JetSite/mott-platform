import { ChatOpenAI } from '@langchain/openai';

import { env } from '~/env';

const cache: { [key: string]: ChatOpenAI } = {};

export function createLLM(model = 'gpt-4o-2024-08-06') {
  if (cache[model]) {
    return cache[model];
  }

  const llm = new ChatOpenAI({
    model,
    apiKey: env.OPENAI_API_KEY,
    temperature: 0,
  });

  cache[model] = llm;
  return llm;
}
