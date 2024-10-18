import type { BaseLanguageModelInterface } from "@langchain/core/language_models/base";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";

import type BigQuerySource from "../../datasource/bigquery";
import type { Answer } from "../../datasource/types";

interface SqlTool {
  db: BigQuerySource;
}

export class ColumnValuesTool extends Tool implements SqlTool {
  static lc_name() {
    return "ColumnValuesSqlTool";
  }
  db: BigQuerySource;
  name = "column-values-sql";
  description =
    "Use this tool to get unique values from a column in a SQL table. " +
    "You must provide correct SQL query. Always limit your query to at most 50 results";

  constructor(db: BigQuerySource) {
    super();
    this.db = db;
  }

  async _call(input: string): Promise<Answer> {
    return await this.db.runQuery(input);
  }
}

export class EntityNameSqlTool extends Tool implements SqlTool {
  static lc_name() {
    return "EntityNameSqlTool";
  }
  db: BigQuerySource;
  name = "entity-name-sql";
  description =
    "Use this tool to find the name of an entity given its ID." +
    " You must provide correct SQL query. Always limit your query to at most 100 results";

  constructor(db: BigQuerySource) {
    super();
    this.db = db;
  }

  async _call(input: string): Promise<Answer> {
    return await this.db.runQuery(input);
  }
}

export class SchemaSqlTool extends Tool {
  static lc_name() {
    return "SchemaSqlTool";
  }
  db: BigQuerySource;
  name = "schema-sql";
  description = `Input to this tool is a comma-separated list of tables, output is the schema.
     Be sure that the tables actually exist by calling list-tables-sql first! 
     Example Input: "database.table1, database.table2, database.table3."`;
  constructor(db: BigQuerySource) {
    super();
    this.db = db;
  }

  async _call(tablesToInclude?: string): Promise<string> {
    const tables = tablesToInclude ? tablesToInclude.split(",") : [];
    const schemas = await Promise.all(
      tables.map((table) => {
        const [database, tableName] = table.trim().split(".");
        return this.db.getRawSchema(database ?? "", tableName ?? "");
      }),
    );
    return JSON.stringify(
      schemas.reduce(
        (acc: Record<string, unknown>, schema: unknown, index: number) => {
          acc[tables[index] ?? ""] = schema;
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    );
  }
}
export class SqlQueryCheckerTool extends Tool {
  static lc_name() {
    return "SqlQueryCheckerTool";
  }

  name = "sql-query-checker";

  template = `
    {query}
Double check the BigQuery SQL query above for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Ensuring that BETWEEN with date fields always uses proper casting (e.g., CAST(field AS DATE) BETWEEN CAST(...) AND CAST(...))
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins
- Using appropriate partitioning and clustering for large tables
- Avoiding SELECT * for better performance
- Using appropriate wildcards in table names when querying across multiple tables

If there are any of the above mistakes, rewrite the query. In particular, always rewrite date comparisons using BETWEEN to include proper casting. 
If there are no mistakes, just reproduce the original query.`;

  llm: BaseLanguageModelInterface;

  constructor(llm: BaseLanguageModelInterface) {
    super();
    this.llm = llm;
  }

  async _call(input: string) {
    const prompt = PromptTemplate.fromTemplate(this.template);
    const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
    return await chain.invoke({ query: input });
  }

  description = `Use this tool to double check if your BigQuery SQL query is correct before executing it.
    Always use this tool before executing a query with query-sql!`;
}

export class QuerySqlTool extends Tool implements SqlTool {
  static lc_name() {
    return "QuerySqlTool";
  }

  name = "query-sql";

  db: BigQuerySource;

  constructor(db: BigQuerySource) {
    super();
    this.db = db;
  }

  /** @ignore */
  async _call(input: string) {
    try {
      const result = await this.db.runQuery(input);
      return result.hasResult ? JSON.stringify(result.rows) : [];
    } catch (error) {
      return `${error}`;
    }
  }

  description = `Input to this tool is a detailed and correct SQL query, output is a result from the database.
  If the query is not correct, an error message will be returned.
  If an error is returned, rewrite the query, check the query, and try again.`;
}

export class ListTablesSqlTool extends Tool implements SqlTool {
  static lc_name() {
    return "ListTablesSqlTool";
  }

  name = "list-tables-sql";

  db: BigQuerySource;

  constructor(db: BigQuerySource) {
    super();
    this.db = db;
  }

  async _call(_: string) {
    try {
      const tables = this.db.getTables();
      const result = tables
        .map(
          (table: { database: string; name: string }) =>
            `${table.database}.${table.name}`,
        )
        .join(",");
      return result;
    } catch (error) {
      return `${error}`;
    }
  }

  description =
    "Input is an empty string, output is a comma-separated list of tables in the database.";
}
