import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { User } from "../user/schema";
import { Workspace } from "../workspace/schema";

export const File = pgTable(
  "files",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text("name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    path: text("path").notNull(),
    width: integer("width"),
    height: integer("height"),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => Workspace.id, {
        onDelete: "cascade",
      }),
    uploadedBy: text("uploaded_by")
      .notNull()
      .references(() => User.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (file) => ({
    workspaceIdx: index("files_workspace_id_idx").on(file.workspaceId),
    uploadedByIdx: index("files_uploaded_by_idx").on(file.uploadedBy),
  }),
);

export const FileRelations = relations(File, ({ one }) => ({
  workspace: one(Workspace, {
    fields: [File.workspaceId],
    references: [Workspace.id],
  }),
  uploadedByUser: one(User, {
    fields: [File.uploadedBy],
    references: [User.id],
  }),
}));
