import type {
  Answer,
  DataSourceType,
  DatabaseSchema,
  Row,
  TableInfo,
  TableSchema,
} from './types';

export abstract class DataSource {
  protected readonly allowedDatabases: string[];
  protected readonly allowedTables: string[];
  protected databases: DatabaseSchema[] = [];
  protected initializationPromise: Promise<void>;

  constructor(
    public name: string,
    key: string,
    allowedDatabases: string[],
    allowedTables: string[]
  ) {
    this.init(key);
    this.initializationPromise = this.loadSchemas();
    this.allowedDatabases = allowedDatabases;
    this.allowedTables = allowedTables;
  }

  public async getTables(): Promise<TableSchema[]> {
    await this.getInitializationPromise();

    return this.databases.flatMap((databaseSchema) => databaseSchema.schemas);
  }
  public async getTablesList(): Promise<
    Array<{ database: string; name: string }>
  > {
    await this.getInitializationPromise();

    return this.databases.flatMap((db) =>
      db.schemas.map((schema) => ({
        database: db.name,
        name: schema.name,
      }))
    );
  }

  public async getTable(uniqueId: string): Promise<TableSchema | undefined> {
    const tables = await this.getTables();
    return tables.find((tableSchema) => tableSchema.getUniqueID() === uniqueId);
  }

  public getDatabases(): DatabaseSchema[] {
    return this.databases;
  }

  public async getInitializationPromise(): Promise<void> {
    await this.initializationPromise;
  }

  public getQuestionPrompt(question: string): string {
    return `Question: ${question}`;
  }

  protected async loadSchemas(): Promise<void> {
    const databases = (await this.loadDatabaseNames()).filter(
      (database: string) =>
        this.allowedDatabases.length === 0 ||
        this.allowedDatabases.includes(database)
    );
    this.databases = [];
    for (const database of databases) {
      const loadedDatabase = await this.loadDatabase(database);
      this.databases.push(loadedDatabase);
    }

    if (this.databases.flatMap((database) => database.schemas).length === 0) {
      throw new Error(
        'No table loaded, please double check your data source and whitelist tables.'
      );
    }
  }

  protected tryExtractPartitionTable(table: string): string | [string, string] {
    return table;
  }

  protected isTableAllowed(table: string, database: string): boolean {
    if (this.allowedTables.length === 0) {
      return true;
    }

    const fullTableName = `${database}.${table}`;
    const matchRegex =
      this.allowedTables.find((allowedTable) => {
        const regexStr = `^${allowedTable
          .split('*')
          .map((str: string) =>
            str.replace(/([.*+?^=!:${}()|\\[\\]\/\\])/g, '\\$1')
          )
          .join('.*')}$`;
        return new RegExp(regexStr).test(fullTableName);
      }) != null;
    return matchRegex || this.allowedTables.includes(fullTableName);
  }

  protected loadDatabase = async (
    database: string
  ): Promise<DatabaseSchema> => {
    const tables = (await this.loadTableNames(database)).filter((table) =>
      this.isTableAllowed(table, database)
    );

    const extractTables = new Map<string, TableInfo>();
    for (const table of tables) {
      const extracted = this.tryExtractPartitionTable(table);

      if (typeof extracted === 'string') {
        extractTables.set(table, {
          name: table,
          isSuffixPartitionTable: false,
        });
        continue;
      }

      const [tableName, partitionSuffix] = extracted;
      if (extractTables.has(tableName)) {
        extractTables.get(tableName)?.suffixes?.push(partitionSuffix);
        continue;
      }
      extractTables.set(tableName, {
        name: tableName,
        isSuffixPartitionTable: true,
        suffixes: [partitionSuffix],
      });
    }

    const schemas = [];
    for (const table of extractTables.values()) {
      const schema = await this.loadTableSchema(database, table);
      schemas.push(schema);
    }
    return {
      name: database,
      schemas,
    };
  };

  protected includeDatabaseNameInQuery(): boolean {
    return true;
  }

  protected useFormattedSchema(): boolean {
    return true;
  }

  protected abstract init(key: string): void;
  public abstract readonly dataSourceType: DataSourceType;
  protected abstract loadDatabaseNames(): Promise<string[]>;
  protected abstract loadTableNames(database: string): Promise<string[]>;
  protected abstract loadTableSchema(
    database: string,
    table: TableInfo
  ): Promise<TableSchema>;
  protected async enrichTableSchema(): Promise<void> {}

  public abstract runQuery(query: string): Promise<Answer>;
  public abstract getRawSchema(database: string, table: string): Promise<Row[]>;
}
