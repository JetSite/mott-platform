import { z } from "zod";

import { workspaceSettingsSchema } from "@mott/db/schema";

export const UpdateWorkspaceSchema = z.object({
  name: z.string().optional(),
  settings: workspaceSettingsSchema.deepPartial(),
});

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
