import { strToApproxTokenCount } from "./tokens";

export function addDocumentationToPrompt(
  initialPrompt: string,
  documentationList: string[],
  maxTokens = 14000
): string {
  let updatedPrompt = initialPrompt;
  if (documentationList.length > 0) {
    updatedPrompt += "\n\n=== Additional Context === \n\n";

    for (const documentation of documentationList) {
      if (
        strToApproxTokenCount(initialPrompt) +
          strToApproxTokenCount(documentation) <
        maxTokens
      ) {
        updatedPrompt += `${documentation}\n\n`;
      }
    }
  }

  return updatedPrompt;
}
export function addInstructionsToPrompt(
  initialPrompt: string,
  documentationList: string[],
  maxTokens = 14000
): string {
  let updatedPrompt = initialPrompt;
  if (documentationList.length > 0) {
    updatedPrompt += "\n\n=== Additional Instructions === \n\n";

    for (const documentation of documentationList) {
      if (
        strToApproxTokenCount(initialPrompt) +
          strToApproxTokenCount(documentation) <
        maxTokens
      ) {
        updatedPrompt += `${documentation}\n\n`;
      }
    }
  }

  return updatedPrompt;
}

export function addDDLToPrompt(
  initialPrompt: string,
  ddlList: string[],
  maxTokens = 14000
): string {
  let updatedPrompt = initialPrompt;
  if (ddlList.length > 0) {
    updatedPrompt += "\n===Tables \n";
    for (const ddl of ddlList) {
      if (
        strToApproxTokenCount(initialPrompt) + strToApproxTokenCount(ddl) <
        maxTokens
      ) {
        updatedPrompt += `${ddl}\n\n`;
      }
    }
  }

  return updatedPrompt;
}

export function addSQLToPrompt(
  initialPrompt: string,
  sqlList: { sql: string; question: string }[],
  maxTokens = 14000
): string {
  let updatedPrompt = initialPrompt;
  if (sqlList.length > 0) {
    updatedPrompt += "\n===Question-SQL Pairs\n\n";
    for (const sqlItem of sqlList) {
      if (
        strToApproxTokenCount(updatedPrompt) +
          strToApproxTokenCount(sqlItem.sql) <
        maxTokens
      ) {
        updatedPrompt += `${sqlItem.question}\n${sqlItem.sql}\n\n`;
      }
    }
  }

  return updatedPrompt;
}
