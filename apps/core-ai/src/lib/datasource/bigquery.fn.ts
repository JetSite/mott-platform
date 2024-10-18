import type { FormattedMetadata, TableField } from "@google-cloud/bigquery";
import { BigQuery } from "@google-cloud/bigquery";

import type { DataSourceConfig } from "./datasource.fn";
import type { Answer, FieldDefinition, Row, TableInfo } from "./types";
import { createDataSource } from "./datasource.fn";
import { DataSourceType, TableSchema } from "./types";

export type BigQuerySource = {
  init: (key: string) => void;
  loadDatabaseNames: () => Promise<string[]>;
  loadTableNames: (database: string) => Promise<string[]>;
  loadFieldDefinition?: (field: TableField) => FieldDefinition;
  getStringFields: (
    table: TableSchema,
    field: FieldDefinition,
    parentFields?: string[],
  ) => string[];
  runQuery: (query: string) => Promise<Answer>;
  getRawSchema: (database: string, table: string) => Promise<Row[]>;
  loadTableSchema: (database: string, table: TableInfo) => Promise<TableSchema>;
  dataSourceType: DataSourceType.BigQuery;
  useFormattedSchema: () => boolean;
};

const createBigQuerySource = (
  bqKey: string,
  allowedDatabases: string[],
  allowedTables: string[],
): BigQuerySource => {
  let bigquery: BigQuery | null = null;

  const init = (key: string): void => {
    const credentials = JSON.parse(key);
    bigquery = new BigQuery({
      projectId: credentials.project_id,
      credentials,
    });
    if (!bigquery) {
      throw new Error("Failed to initialize bigquery client");
    }
  };

  const loadDatabaseNames = async (): Promise<string[]> => {
    if (!bigquery) {
      throw new Error("BigQuery client not initialized");
    }
    const [datasets] = await bigquery.getDatasets();
    return datasets.map((dataset) => dataset.id ?? "");
  };

  const loadTableNames = async (database: string): Promise<string[]> => {
    if (!bigquery) {
      throw new Error("BigQuery client not initialized");
    }
    const [tables] = await bigquery.dataset(database).getTables();
    return tables.map((table) => table.id ?? "");
  };

  const loadFieldDefinition = (field: TableField): FieldDefinition => {
    const baseFieldDefinition: FieldDefinition = {
      name: field.name ?? "",
      description: field.description ?? "",
      type: "",
      required: false,
    };

    if (field.type === "RECORD") {
      baseFieldDefinition.nestedFields = field.fields?.map(loadFieldDefinition);
    }

    switch (field.mode) {
      case "REPEATED":
        return {
          ...baseFieldDefinition,
          type: `Array<${field.type ?? ""}>`,
          required: true,
        };
      default:
        return {
          ...baseFieldDefinition,
          type: field.type ?? "",
          required: field.mode === "REQUIRED",
        };
    }
  };

  const getStringFields = (
    table: TableSchema,
    field: FieldDefinition,
    parentFields: string[] = [],
  ): string[] => {
    if (field.type === "STRING") {
      const fieldPath =
        parentFields.length > 0
          ? `${parentFields.join(".")}.${field.name}`
          : field.name;
      return [`${table.getUniqueID()}|${fieldPath}`];
    }
    if (field.type === "RECORD" || field.type === "Array<RECORD>") {
      return (
        field.nestedFields?.flatMap((nestedField) =>
          getStringFields(table, nestedField, [...parentFields, field.name]),
        ) ?? []
      );
    }
    return [];
  };

  const runQuery = async (query: string): Promise<Answer> => {
    if (!bigquery) {
      throw new Error("BigQuery client not initialized");
    }
    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    return { query, hasResult: true, rows };
  };

  const getRawSchema = async (
    database: string,
    table: string,
  ): Promise<Row[]> => {
    if (!bigquery) {
      throw new Error("BigQuery client not initialized");
    }
    const [metadata] = (await bigquery
      .dataset(database)
      .table(table)
      .getMetadata()) as FormattedMetadata[];
    return (
      metadata?.schema?.fields?.map((field) => ({
        name: field.name ?? "",
        type: field.type ?? "",
        description: field.description ?? "",
      })) ?? []
    );
  };

  const loadTableSchema = async (
    database: string,
    table: TableInfo,
  ): Promise<TableSchema> => {
    if (!bigquery) {
      throw new Error("BigQuery client not initialized");
    }
    const [{ schema, description }] = await bigquery
      .dataset(database)
      .table(table.name)
      .getMetadata();

    const tableNameToPullRawSchema = table.isSuffixPartitionTable
      ? `${table.name.slice(0, -1)}${table.suffixes?.[0]}`
      : table.name;
    const query = `SELECT table_name, ddl as result FROM \`${database}\`.INFORMATION_SCHEMA.TABLES WHERE table_name = '${tableNameToPullRawSchema}';`;
    const result = await runQuery(query);

    const rawSchemaDefinition =
      result.hasResult && result.rows?.[0]?.result
        ? `${result.rows[0].result}`.replace(
            tableNameToPullRawSchema,
            table.name,
          )
        : "";

    if (!schema?.fields) {
      throw new Error(`${database}, ${table.name} has no fields.`);
    }

    const fieldDefinitions: FieldDefinition[] =
      schema.fields.map(loadFieldDefinition);
    return new TableSchema(
      table.name,
      database,
      description ?? "",
      fieldDefinitions,
      DataSourceType.BigQuery,
      rawSchemaDefinition,
      table.isSuffixPartitionTable,
      table.suffixes,
    );
  };

  const config: DataSourceConfig = {
    name: "BigQuery",
    key: bqKey,
    allowedDatabases,
    allowedTables,
  };

  const baseDataSource = createDataSource(config);

  init(bqKey);

  return {
    ...baseDataSource,
    init,
    loadDatabaseNames,
    loadTableNames,
    loadTableSchema,
    dataSourceType: DataSourceType.BigQuery,
    runQuery,
    getRawSchema,
    useFormattedSchema: () => false,
    getStringFields,
  };
};

export default createBigQuerySource;
