import {
  Answer,
  DataSourceType,
  DatabaseSchema,
  Row,
  TableInfo,
  TableSchema,
} from "./types";

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

  public getTables(): TableSchema[] {
    return this.databases.flatMap((databaseSchema) => databaseSchema.schemas);
  }

  public getTable(uniqueId: string): TableSchema | undefined {
    return this.getTables().find(
      (tableSchema) => tableSchema.getUniqueID() === uniqueId
    );
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

    this.databases = await Promise.all(
      databases.map(async (database) => await this.loadDatabase(database))
    );

    if (this.databases.flatMap((database) => database.schemas).length === 0) {
      throw new Error(
        "No table loaded, please double check your data source and whitelist tables."
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
        const regexStr =
          "^" +
          allowedTable
            .split("*")
            .map((str: string) =>
              str.replace(/([.*+?^=!:${}()|\\[\\]\/\\])/g, "\\$1")
            )
            .join(".*") +
          "$";
        return new RegExp(regexStr).test(fullTableName);
      }) != null;
    return matchRegex || this.allowedTables.includes(fullTableName);
  }

  protected async loadDatabase(database: string): Promise<DatabaseSchema> {
    const tables = (await this.loadTableNames(database)).filter((table) =>
      this.isTableAllowed(table, database)
    );

    const extractTables = new Map<string, TableInfo>();
    for (const table of tables) {
      const extracted = this.tryExtractPartitionTable(table);

      if (typeof extracted === "string") {
        extractTables.set(table, {
          name: table,
          isSuffixPartitionTable: false,
        });
        continue;
      }

      const [tableName, partitionSuffix] = extracted;
      if (extractTables.has(tableName)) {
        extractTables.get(tableName)?.suffixes!.push(partitionSuffix);
        continue;
      }
      extractTables.set(tableName, {
        name: tableName,
        isSuffixPartitionTable: true,
        suffixes: [partitionSuffix],
      });
    }

    return await Promise.all(
      Array.from(extractTables.values()).map(
        async (table) =>
          await this.loadTableSchema(database, table).then((schema) => {
            return schema;
          })
      )
    ).then((schemas) => ({
      name: database,
      schemas,
    }));
  }

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
