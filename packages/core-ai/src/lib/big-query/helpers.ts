import { BigQuery } from "@google-cloud/bigquery";

interface TableField {
  name: string;
}

export async function getTableColumnNames(
  secretKey: object,
  datasetName: string,
  tableName: string
): Promise<string[]> {
  const bigquery = new BigQuery({ credentials: secretKey });
  const [tableMetadata] = await bigquery
    .dataset(datasetName)
    .table(tableName)
    .getMetadata();

  const columnNames: string[] = tableMetadata.schema.fields.map(
    (field: TableField) => field.name
  );

  return columnNames;
}
