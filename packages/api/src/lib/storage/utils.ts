import crypto from "node:crypto";
import type { Options } from "@sindresorhus/slugify";
import slugify from "@sindresorhus/slugify";

export function nameToSlug(
  name: string,
  options: Options = { separator: "-" },
): string {
  if (!name.trim()) {
    throw new Error("File name cannot be empty");
  }
  return slugify(name, options);
}

export function generateFileName(name: string): string {
  const MAX_FILENAME_LENGTH = 255;
  const baseName = nameToSlug(name, { separator: "_", lowercase: false });

  const randomSuffixLength = 11;

  if (baseName.length > MAX_FILENAME_LENGTH - randomSuffixLength) {
    throw new Error(
      `File name is too long. Maximum allowed length: ${
        MAX_FILENAME_LENGTH - randomSuffixLength
      } characters`,
    );
  }

  const randomSuffix = crypto.randomBytes(5).toString("hex");
  return `${baseName}_${randomSuffix}`;
}
