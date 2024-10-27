import type { ChainValues } from '@langchain/core/utils/types';

export function extractJsonFromOutput(text: string) {
  // Define the regular expression pattern to match JSON blocks
  const pattern = /```json\s*((.|\n)*?)\s*```/gs;

  // Find all non-overlapping matches of the pattern in the string
  const matches = pattern.exec(text);

  if (matches?.[1]) {
    try {
      return JSON.parse(matches[1].trim());
    } catch (_error) {
      throw new Error(`Failed to parse: ${matches[1]}`);
    }
  } else {
    throw new Error(`No JSON found in: ${text}`);
  }
}

export function getLastQuerySqlInput(data: ChainValues): string | null {
  const lastQuerySqlStep = data.intermediateSteps
    .reverse()
    .find(
      (step: { action: { tool: string; toolInput?: { input: string } } }) =>
        step.action.tool === 'query-sql'
    );

  if (lastQuerySqlStep) {
    return lastQuerySqlStep.action.toolInput.input;
  }

  return null;
}
