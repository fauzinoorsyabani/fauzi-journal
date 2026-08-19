import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * A story is intentionally stored as an editorial record rather than a document blob.
 * Chapter JSON retains flexible cinematic layouts while top-level fields stay queryable.
 */
export const stories = mysqlTable("stories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  storyNumber: int("storyNumber").notNull(),
  category: varchar("category", { length: 72 }).notNull(),
  title: text("title").notNull(),
  cardTitle: varchar("cardTitle", { length: 220 }),
  deck: text("deck").notNull(),
  author: varchar("author", { length: 160 }).notNull(),
  readTime: varchar("readTime", { length: 48 }).notNull(),
  accent: varchar("accent", { length: 160 }),
  impact: text("impact"),
  heroImageUrl: text("heroImageUrl").notNull(),
  heroImageKey: varchar("heroImageKey", { length: 512 }),
  heroImageAlt: text("heroImageAlt").notNull(),
  heroImagePosition: varchar("heroImagePosition", { length: 96 }),
  chaptersJson: text("chaptersJson").notNull(),
  richContentJson: text("richContentJson"),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdBy: int("createdBy").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StoryRecord = typeof stories.$inferSelect;
export type InsertStoryRecord = typeof stories.$inferInsert;

/**
 * Public media inquiries become durable leads. They can be reviewed internally now
 * and relayed to a chosen email or CRM provider in a later credentialed integration.
 */
export const mediaInquiries = mysqlTable("mediaInquiries", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  outlet: varchar("outlet", { length: 220 }),
  inquiryType: varchar("inquiryType", { length: 96 }).notNull(),
  message: text("message").notNull(),
  sourcePath: varchar("sourcePath", { length: 320 }),
  status: mysqlEnum("status", ["new", "reviewed", "contacted"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MediaInquiry = typeof mediaInquiries.$inferSelect;
export type InsertMediaInquiry = typeof mediaInquiries.$inferInsert;

/** Readers who explicitly ask to receive new journal announcements. */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  displayName: varchar("displayName", { length: 160 }),
  status: mysqlEnum("status", ["subscribed", "unsubscribed"]).default("subscribed").notNull(),
  consentAt: timestamp("consentAt").defaultNow().notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 96 }).notNull().unique(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/** A durable audit record for every subscriber email sent after journal publish. */
export const newsletterDeliveries = mysqlTable("newsletterDeliveries", {
  id: int("id").autoincrement().primaryKey(),
  storyId: int("storyId").notNull().references(() => stories.id),
  subscriberId: int("subscriberId").notNull().references(() => subscribers.id),
  provider: varchar("provider", { length: 48 }).default("resend").notNull(),
  status: mysqlEnum("status", ["queued", "sent", "failed"]).default("queued").notNull(),
  providerMessageId: varchar("providerMessageId", { length: 320 }),
  errorMessage: text("errorMessage"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterDelivery = typeof newsletterDeliveries.$inferSelect;
export type InsertNewsletterDelivery = typeof newsletterDeliveries.$inferInsert;
