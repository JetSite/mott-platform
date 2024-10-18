import type {
  Answer,
  DatabaseSchema,
  DataSourceType,
  Row,
  TableInfo,
  TableSchema,
} from "./types";

export interface DataSourceConfig {
  name: string;
  key: string;
  allowedDatabases: string[];
  allowedTables: string[];
}

export const createDataSource = (config: DataSourceConfig) => {
  const { name, key, allowedDatabases, allowedTables } = config;
  let databases: DatabaseSchema[] = [];
  let initializationPromise: Promise<void> = Promise.resolve();

  const init = (key: string): void => {
    // Реализация init
  };

  const loadSchemas = async (): Promise<void> => {
    const loadedDatabases = await loadDatabaseNames();
    const filteredDatabases = loadedDatabases.filter(
      (database: string) =>
        allowedDatabases.length === 0 || allowedDatabases.includes(database),
    );

    databases = await Promise.all(
      filteredDatabases.map((database) => loadDatabase(database)),
    );

    if (databases.flatMap((database) => database.schemas).length === 0) {
      throw new Error(
        "No table loaded, please double check your data source and whitelist tables.",
      );
    }
  };

  const getTables = (): TableSchema[] =>
    databases.flatMap((databaseSchema) => databaseSchema.schemas);

  const getTable = (uniqueId: string): TableSchema | undefined =>
    getTables().find((tableSchema) => tableSchema.getUniqueID() === uniqueId);

  const getDatabases = (): DatabaseSchema[] => databases;

  const getInitializationPromise = async (): Promise<void> =>
    await initializationPromise;

  const getQuestionPrompt = (question: string): string =>
    `Question: ${question}`;

  const tryExtractPartitionTable = (table: string): string | [string, string] =>
    table;

  const isTableAllowed = (table: string, database: string): boolean => {
    if (allowedTables.length === 0) return true;

    const fullTableName = `${database}.${table}`;
    const matchRegex = allowedTables.some((allowedTable) => {
      const regexStr = `^${allowedTable
        .split("*")
        .map((str: string) =>
          str.replace(/([.*+?^=!:${}()|\\[\\]\/\\])/g, "\\$1"),
        )
        .join(".*")}$`;
      return new RegExp(regexStr).test(fullTableName);
    });
    return matchRegex || allowedTables.includes(fullTableName);
  };

  const loadDatabase = async (database: string): Promise<DatabaseSchema> => {
    const tables = (await loadTableNames(database)).filter((table) =>
      isTableAllowed(table, database),
    );

    const extractTables = tables.reduce((acc, table) => {
      const extracted = tryExtractPartitionTable(table);

      if (typeof extracted === "string") {
        acc.set(table, { name: table, isSuffixPartitionTable: false });
      } else {
        const [tableName, partitionSuffix] = extracted;
        if (acc.has(tableName)) {
          acc.get(tableName)?.suffixes?.push(partitionSuffix);
        } else {
          acc.set(tableName, {
            name: tableName,
            isSuffixPartitionTable: true,
            suffixes: [partitionSuffix],
          });
        }
      }
      return acc;
    }, new Map<string, TableInfo>());

    const schemas = await Promise.all(
      Array.from(extractTables.values()).map((table) =>
        loadTableSchema(database, table),
      ),
    );

    return { name: database, schemas };
  };

  const includeDatabaseNameInQuery = (): boolean => true;

  const useFormattedSchema = (): boolean => true;

  // Абстрактные методы, которые должны быть реализованы
  const loadDatabaseNames = (): Promise<string[]> => {
    throw new Error("Not implemented");
  };

  const loadTableNames = (database: string): Promise<string[]> => {
    throw new Error("Not implemented");
  };

  const loadTableSchema = (
    database: string,
    table: TableInfo,
  ): Promise<TableSchema> => {
    throw new Error("Not implemented");
  };

  const enrichTableSchema = async (): Promise<void> => {};

  const runQuery = (query: string): Promise<Answer> => {
    throw new Error("Not implemented");
  };

  const getRawSchema = (database: string, table: string): Promise<Row[]> => {
    throw new Error("Not implemented");
  };

  // Инициализация
  init(key);
  initializationPromise = loadSchemas();

  return {
    name,
    getTables,
    getTable,
    getDatabases,
    getInitializationPromise,
    getQuestionPrompt,
    runQuery,
    getRawSchema,
  };
};
