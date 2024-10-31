import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { WorkspaceSettings } from "./workspace/validation";

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "welcome",
  "company_info",
  "chat_selection",
  "completed",
]);

export const CorporateChat = {
  DISCORD: "discord",
  SLACK: "slack",
  TEAMS: "teams",
  GOOGLE_CHAT: "google_chat",
  WHATSAPP: "whatsapp",
  IMESSAGE: "imessage",
};

export type CorporateChat = (typeof CorporateChat)[keyof typeof CorporateChat];

export const corporateChatEnum = pgEnum(
  "corporate_chat",
  Object.values(CorporateChat) as [string, ...string[]],
);

export const AICustomInstructions = pgTable("ai_custom_instructions", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  instructions: text("instructions").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const AICustomInstructionsRelations = relations(
  AICustomInstructions,
  ({ one }) => ({
    user: one(User, {
      fields: [AICustomInstructions.userId],
      references: [User.id],
    }),
  }),
);

export const User = pgTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 255 }),
  jobRole: varchar("job_role", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
  onboardingStep: onboardingStepEnum("onboarding_step")
    .notNull()
    .default("welcome"),
});

export const OnboardingData = pgTable("onboarding_data", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 255 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  corporateChat: corporateChatEnum("corporate_chat"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  customInstructions: many(AICustomInstructions),
}));

export const Account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

export const VerificationToken = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

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
  settings: text("settings").$type<WorkspaceSettings>(),
  slug: text("slug").notNull().unique(),
  stripeId: text("stripe_id"),
  subscriptionId: text("subscription_id"),
  paidUntil: timestamp("paid_until", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
export const storageProviderEnum = pgEnum("storage_provider", ["vercel", "s3"]);

export const File = pgTable("files", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  width: integer("width"),
  height: integer("height"),
  storageProvider: storageProviderEnum("storage_provider")
    .notNull()
    .default("s3"),
  workspaceId: text("workspace_id").references(() => Workspace.id, {
    onDelete: "cascade",
  }),
  uploadedBy: text("uploaded_by").references(() => User.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
