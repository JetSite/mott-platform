import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';

import { env } from '../../../env';

export const s3 = new S3Client({
  endpoint: env.STORAGE_ENDPOINT_URL,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  },
  maxAttempts: 3,
  retryMode: 'adaptive',
});

async function validateS3Connection() {
  const timeout = 5000; // 5 seconds
  try {
    await Promise.race([
      s3.send(new HeadBucketCommand({ Bucket: env.STORAGE_BUCKET_NAME })),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('S3 connection timeout')), timeout)
      ),
    ]);
    console.log('S3 connection successful');
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'NoSuchBucket') {
      console.error(`Bucket ${env.STORAGE_BUCKET_NAME} not found`);
    } else if (error instanceof Error && error.name === 'AccessDenied') {
      console.error('Access denied to S3 bucket');
    } else {
      console.error('Failed to connect to S3:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof Error ? error.name : 'Unknown code',
        time: new Date().toISOString(),
      });
    }
    throw error;
  }
}
validateS3Connection().catch((error) => {
  console.error('Critical error when checking S3 connection:', error);
  process.exit(1);
});
