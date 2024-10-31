import crypto from "node:crypto";
import type { Options } from "@sindresorhus/slugify";
import slugify from "@sindresorhus/slugify";

export const nameToSlug = (
  name: string,
  options: Options = { separator: "-" },
) => slugify(name, options);

export const generateFileName = (name: string): string => {
  const baseName = nameToSlug(name, { separator: "_", lowercase: false });
  const randomSuffix = crypto.randomBytes(5).toString("hex");
  return `${baseName}_${randomSuffix}`;
};
