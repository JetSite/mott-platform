import { z } from "zod";

import { workspaceSettingsSchema } from "@mott/db/schema";

export const UpdateWorkspaceSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  settings: workspaceSettingsSchema,
});

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;
