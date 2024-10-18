import type { BaseLanguageModelInterface } from "@langchain/core/language_models/base";
import type { SqlDatabase } from "langchain/sql_db";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";

interface SqlTool {
  db: SqlDatabase;
}

export class ColumnValuesTool extends Tool implements SqlTool {
  static lc_name() {
    return "ColumnValuesSqlTool";
  }
  db: SqlDatabase;
  name = "column-values-sql";
  description =
    "Use this tool to get unique values from a column in a SQL table. " +
    "You must provide correct SQL query. Always limit your query to at most 50 results";

  constructor(db: SqlDatabase) {
    super();
    this.db = db;
  }

  async _call(input: string): Promise<string> {
    return await this.db.run(input);
  }
}

export class EntityNameSqlTool extends Tool implements SqlTool {
  static lc_name() {
    return "EntityNameSqlTool";
  }
  db: SqlDatabase;
  name = "entity-name-sql";
  description =
    "Use this tool to find the name of an entity given its ID." +
    " You must provide correct SQL query. Always limit your query to at most 100 results";

  constructor(db: SqlDatabase) {
    super();
    this.db = db;
  }

  async _call(input: string): Promise<string> {
    return await this.db.run(input);
  }
}

export class SchemaSqlTool extends Tool implements SqlTool {
  static lc_name() {
    return "SchemaSqlTool";
  }
  db: SqlDatabase;
  name = "schema-sql";
  description = `Input to this tool is a comma-separated list of tables, output is the schema.
     Be sure that the tables actually exist by calling list-tables-sql first! 
     Example Input: "table1, table2, table3."`;
  constructor(db: SqlDatabase) {
    super();
    this.db = db;
  }

  async _call(tablesToInclude?: string): Promise<string> {
    let tableFilter = "";
    const tables = tablesToInclude
      ? tablesToInclude.split(",").map((table) => table.trim())
      : [];
    if (tables.length > 0) {
      tableFilter = `AND TABLE_NAME IN ('${tables.join("', '")}')`;
    }
    // Postgresql
    const sqlQuery = `SELECT json_agg(
      json_build_object(
        'table', table_name,
        'columns', columns
      )
    ) AS result
    FROM (
      SELECT 
        table_name,
        json_agg(
          json_build_object(
            column_name, data_type
          )
        ) AS columns
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public'
        AND column_name NOT LIKE '_airbyte_%'
        ${tableFilter}
      GROUP BY 
        table_name
    ) subquery;`;
    return await this.db.run(sqlQuery);
  }
}

export class SqlQueryCheckerTool extends Tool {
  static lc_name() {
    return "SqlQueryCheckerTool";
  }

  name = "sql-query-checker";

  template = `
    {query}
Double check the PostgreSQL query above for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Ensuring that BETWEEN with date fields always uses proper casting (e.g., CAST(field AS DATE) BETWEEN CAST(...) AND CAST(...))
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

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

  description = `Use this tool to double check if your query is correct before executing it.
    Always use this tool before executing a query with query-sql!`;
}
