import { basename, extname } from "node:path";
import consumers from "node:stream/consumers";
import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { lookup } from "mime-types";

import { env } from "~/env";
import { s3 } from "~/lib/storage/s3/client";
import { generateFileName } from "../utils";

export function generateS3Key(name: string, temporary = false): string {
  const ext = extname(name);
  const fileName = basename(name, ext);
  const hash = generateFileName(fileName);
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${(date.getMonth() + 1).toString()}`.slice(-2);
  const day = date.getDate();
  const newKey = `${temporary ? "temp/" : ""}${year}/${month}/${day}/${hash + ext}`;
  return newKey;
}

export async function createPresignedUrl(
  key: string,
  type: "get" | "put" = "put",
  download = false,
) {
  const ext = key.split(".").pop();
  const mimeType = !download
    ? lookup(ext ?? "") || "application/octet-stream"
    : "application/octet-stream";
  if (type === "get") {
    const objectParams: GetObjectCommandInput = {
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: key,
      ResponseContentType: mimeType,
    };
    const command = new GetObjectCommand(objectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
    return { key, url };
  }
  const objectParams: PutObjectCommandInput = {
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  };
  const command = new PutObjectCommand(objectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
  return { key, url };
}

export async function getFile(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
  });
  const response = await s3.send(command);
  return response;
}

export async function getFileBuffer(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
  });
  const response = await s3.send(command);
  if (!response.Body) {
    throw new Error("No body found");
  }
  const stream = response.Body as Readable;
  return consumers.buffer(stream);
}

export async function moveFile(oldKey: string, newKey: string) {
  const ext = oldKey.split(".").pop();

  const input = {
    Bucket: env.STORAGE_BUCKET_NAME,
    CopySource: `${env.STORAGE_BUCKET_NAME}/${oldKey}`,
    Key: newKey,
    ContentType: lookup(ext ?? "") || "application/octet-stream",
  };
  const command = new CopyObjectCommand(input);
  try {
    await s3.send(command);
    await deleteFile(oldKey);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function uploadFile(key: string, fileBuffer: Buffer) {
  const ext = key.split(".").pop();
  try {
    const upload = new Upload({
      params: {
        Bucket: env.STORAGE_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ACL: "private",
        CacheControl: "public, max-age=31536000, immutable",
        ContentType: lookup(ext ?? "") || "application/octet-stream",
      },
      client: s3,
      queueSize: 1,
    });
    await upload.done();
  } catch (e) {
    console.log(e);
    throw e;
  }
}
export async function deleteFile(key: string) {
  const input = {
    Bucket: env.STORAGE_BUCKET_NAME,
    Key: key,
  };
  const command = new DeleteObjectCommand(input);
  try {
    await s3.send(command);
  } catch (e) {
    console.log(e);
    throw e;
  }
}
