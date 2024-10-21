import { strToApproxTokenCount } from "./tokens";

export function addDocumentationToPrompt(
  initialPrompt: string,
  documentationList: string[],
  maxTokens = 14000,
): string {
  if (documentationList.length > 0) {
    initialPrompt += "\n\n=== Additional Context === \n\n";

    for (const documentation of documentationList) {
      if (
        strToApproxTokenCount(initialPrompt) +
          strToApproxTokenCount(documentation) <
        maxTokens
      ) {
        initialPrompt += `${documentation}\n\n`;
      }
    }
  }

  return initialPrompt;
}
export function addInstructionsToPrompt(
  initialPrompt: string,
  documentationList: string[],
  maxTokens = 14000,
): string {
  if (documentationList.length > 0) {
    initialPrompt += "\n\n=== Additional Instructions === \n\n";

    for (const documentation of documentationList) {
      if (
        strToApproxTokenCount(initialPrompt) +
          strToApproxTokenCount(documentation) <
        maxTokens
      ) {
        initialPrompt += `${documentation}\n\n`;
      }
    }
  }

  return initialPrompt;
}

export function addDDLToPrompt(
  initialPrompt: string,
  ddlList: string[],
  maxTokens = 14000,
): string {
  if (ddlList.length > 0) {
    initialPrompt += "\n===Tables \n";
    for (const ddl of ddlList) {
      if (
        strToApproxTokenCount(initialPrompt) + strToApproxTokenCount(ddl) <
        maxTokens
      ) {
        initialPrompt += `${ddl}\n\n`;
      }
    }
  }

  return initialPrompt;
}

export function addSQLToPrompt(
  initialPrompt: string,
  sqlList: { sql: string; question: string }[],
  maxTokens = 14000,
): string {
  if (sqlList.length > 0) {
    initialPrompt += "\n===Question-SQL Pairs\n\n";
    for (const sql of sqlList) {
      if (
        strToApproxTokenCount(initialPrompt) + strToApproxTokenCount(sql.sql) <
        maxTokens
      ) {
        initialPrompt += `${sql.question}\n${sql.sql}\n\n`;
      }
    }
  }

  return initialPrompt;
}
