import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env";

export const s3 = new S3Client({
  endpoint: env.STORAGE_ENDPOINT_URL,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
});

async function validateS3Connection() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: env.STORAGE_BUCKET_NAME }));
    console.log("S3 connection successful");
  } catch (error) {
    console.error("Failed to connect to S3:", error);
    throw error;
  }
}

void validateS3Connection();
