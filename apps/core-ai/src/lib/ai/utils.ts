import { similaritySearch } from "../vector_stores/qdrant/utils";

export async function getRelatedDocumentation(question: string) {
  const response = await similaritySearch(question, "documentation");
  return response.map((item) => item.pageContent);
}
export async function getRelatedQuestion(question: string) {
  const response = await similaritySearch(question, "question");
  return response.map((item) => item.pageContent);
}

export async function getRelatedDDL(question: string) {
  const response = await similaritySearch(question, "ddl");
  return response.map((item) => item.pageContent);
}

export async function getSimilarQuestionSql(question: string) {
  const sqlList = await similaritySearch(question, "sql");
  return sqlList.map((item) => ({
    sql: item.metadata.answer,
    question: item.metadata.question,
  }));
}
