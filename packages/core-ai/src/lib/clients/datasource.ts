import { DataSource } from "typeorm";

import { env } from "~/env";

export const dataSource = new DataSource({
  type: "postgres",
  host: env.CLIENT_POSTGRES_HOST,
  port: Number(env.CLIENT_POSTGRES_PORT) || 5432,
  username: env.CLIENT_POSTGRES_USER,
  password: env.CLIENT_POSTGRES_PASSWORD,
  database: env.CLIENT_POSTGRES_DB,
});
