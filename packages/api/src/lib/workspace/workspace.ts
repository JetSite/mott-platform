import slugify from "@sindresorhus/slugify";

import { db } from "@mott/db/client";
import { Workspace } from "@mott/db/schema";

export async function createWorkspace(name: string, ownerId: string) {
  if (!name.trim()) {
    throw new Error("Workspace name is required");
  }
  if (!ownerId.trim()) {
    throw new Error("Owner ID is required");
  }
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    try {
      const slug =
        attempt === 0 ? slugify(name) : `${slugify(name)}-${attempt}`;
      const workspace = await db.insert(Workspace).values({
        companyName: name,
        name,
        slug,
        ownerId,
      });
      return workspace;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("unique constraint")) {
          console.warn(
            `Attempt ${attempt + 1}/${maxAttempts} to create workspace failed: duplicate slug`,
          );
          attempt++;
          continue;
        }
      }
      throw new Error(
        `Error creating workspace: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  throw new Error(
    "Failed to generate unique workspace slug after multiple attempts",
  );
}
