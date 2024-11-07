import { createId } from "@paralleldrive/cuid2";
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { WorkspaceSettings } from ".";
import { User } from "../user/schema";

export const workspacePlans = ["free", "pro", "enterprise"] as const;

export const workspacePlanEnum = pgEnum("workspace_plan", workspacePlans);

export const Workspace = pgTable("workspaces", {
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text("name"),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyWebsite: varchar("company_website", { length: 255 }),
  ownerId: text("owner_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  plan: workspacePlanEnum("plan").notNull().default("free"),
  settings: jsonb("settings").$type<WorkspaceSettings>(),
  slug: text("slug").notNull().unique(),
  stripeId: text("stripe_id"),
  subscriptionId: text("subscription_id"),
  paidUntil: timestamp("paid_until", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
