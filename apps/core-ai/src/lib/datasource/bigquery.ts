import type { FormattedMetadata, TableField } from '@google-cloud/bigquery';
import { BigQuery } from '@google-cloud/bigquery';

import { DataSource } from './datasource';
import type { Answer, FieldDefinition, Row, TableInfo } from './types';
import { DataSourceType, TableSchema } from './types';

export default class BigQuerySource extends DataSource {
  public dataSourceType: DataSourceType = DataSourceType.BigQuery;
  public bigquery: BigQuery | null = null;
  constructor(
    bqKey: string,
    allowedDatabases: string[],
    allowedTables: string[]
  ) {
    super('BigQuery', bqKey, allowedDatabases, allowedTables);
    this.initializationPromise = this.init(bqKey).then(() =>
      this.loadSchemas()
    );
  }

  protected async init(key: string): Promise<void> {
    const credentials = JSON.parse(key);

    this.bigquery = new BigQuery({
      projectId: credentials.project_id,
      credentials,
    });
    if (this.bigquery == null) {
      throw new Error('Failed to initialize bigquery client');
    }
  }

  protected async loadDatabaseNames(): Promise<string[]> {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }
    const [datasets] = await this.bigquery.getDatasets();
    return datasets.map((dataset) => dataset.id ?? '');
  }

  protected async loadTableNames(database: string): Promise<string[]> {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }
    const [tables] = await this.bigquery.dataset(database).getTables();

    return tables.map((table) => table.id ?? '');
  }

  private loadFieldDefinition(field: TableField): FieldDefinition {
    const baseFieldDefinition: FieldDefinition = {
      name: field.name ?? '',
      description: field.description ?? '',
      type: '',
      required: false,
    };

    if (field.type === 'RECORD') {
      baseFieldDefinition.nestedFields = field.fields?.map((nestedField) =>
        this.loadFieldDefinition(nestedField)
      );
    }

    switch (field.mode) {
      case 'REPEATED':
        return {
          ...baseFieldDefinition,
          type: `Array<${field.type ?? ''}>`,
          required: true,
        };
      default:
        return {
          ...baseFieldDefinition,
          type: field.type ?? '',
          required: field.mode === 'REQUIRED',
        };
    }
  }

  private getStringFields(
    table: TableSchema,
    field: FieldDefinition,
    parentFields: string[] = []
  ): string[] {
    if (field.type === 'STRING') {
      if (parentFields.length > 0) {
        return [
          `${table.getUniqueID()}|${parentFields.join('.')}.${field.name}`,
        ];
      }
      return [`${table.getUniqueID()}|${field.name}`];
    }
    if (field.type === 'RECORD' || field.type === 'Array<RECORD>') {
      return (
        field.nestedFields?.flatMap((nestedField) =>
          this.getStringFields(
            table,
            nestedField,
            parentFields.concat([field.name])
          )
        ) ?? []
      );
    }
    return [];
  }

  public async getTablesListFast(): Promise<
    Array<{ database: string; name: string }>
  > {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }

    const [datasets] = await this.bigquery.getDatasets();
    const allowedDatasets = datasets.filter(
      (dataset) =>
        this.allowedDatabases.length === 0 ||
        this.allowedDatabases.includes(dataset.id ?? '')
    );

    const tablesPromises = allowedDatasets.map(async (dataset) => {
      const [tables] = await dataset.getTables();
      return tables
        .filter((table) =>
          this.isTableAllowed(table.id ?? '', dataset.id ?? '')
        )
        .map((table) => ({
          database: dataset.id ?? '',
          name: table.id ?? '',
        }));
    });

    const tablesList = await Promise.all(tablesPromises);
    return tablesList.flat();
  }

  public async runQuery(query: string): Promise<Answer> {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }
    const [job] = await this.bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();

    return {
      query,
      hasResult: true,
      rows,
    };
  }

  public async getRawSchema(database: string, table: string): Promise<Row[]> {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }
    const [metadata] = (await this.bigquery
      .dataset(database)
      .table(table)
      .getMetadata()) as FormattedMetadata[];
    if (metadata?.schema?.fields == null) {
      return [];
    }
    return metadata.schema?.fields?.map((field) => {
      return {
        name: field.name ?? '',
        type: field.type ?? '',
        description: field.description ?? '',
      };
    });
  }

  protected async loadTableSchema(
    database: string,
    table: TableInfo
  ): Promise<TableSchema> {
    if (this.bigquery == null) {
      throw new Error('BigQuery client not initialized');
    }
    const [{ schema, description }] = await this.bigquery
      .dataset(database)
      .table(table.name)
      .getMetadata();
    const tableNameToPullRawSchema = table.isSuffixPartitionTable
      ? `${table.name.substring(0, table.name.length - 1)}${table.suffixes?.[0]}`
      : table.name;
    const query = `SELECT table_name, ddl as result FROM \`${database}\`.INFORMATION_SCHEMA.TABLES WHERE table_name = '${tableNameToPullRawSchema}';`;
    const result = await this.runQuery(query);
    let rawSchemaDefinition = '';
    if (result.hasResult && result.rows?.[0]?.result != null) {
      rawSchemaDefinition = `${result.rows?.[0]?.result}`.replace(
        tableNameToPullRawSchema,
        table.name
      );
    }

    if (schema?.fields == null) {
      throw new Error(`${database}, ${table.name} has no fields.`);
    }

    const fieldDefinitions: FieldDefinition[] = schema.fields.map(
      (field: TableField) => this.loadFieldDefinition(field)
    );
    return new TableSchema(
      table.name,
      database,
      description ?? '',
      fieldDefinitions,
      DataSourceType.BigQuery,
      rawSchemaDefinition,
      table.isSuffixPartitionTable,
      table.suffixes
    );
  }

  protected useFormattedSchema(): boolean {
    return false;
  }
}
