import { S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env";

export const s3 = new S3Client({
  endpoint: env.STORAGE_ENDPOINT_URL,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
});
