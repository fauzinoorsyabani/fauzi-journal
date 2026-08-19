import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { mediaInquiries, newsletterDeliveries, stories, subscribers, type InsertMediaInquiry, type InsertStoryRecord } from "../drizzle/schema";
import { getDb } from "./db";

export async function listPublishedStories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).where(eq(stories.status, "published")).orderBy(desc(stories.publishedAt), desc(stories.createdAt));
}

export async function getPublishedStoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);
  return result[0];
}

export async function getStoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  return result[0];
}

export async function listStoriesForEditor() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stories).orderBy(desc(stories.updatedAt));
}

export async function createStory(input: InsertStoryRecord) {
  const db = await getDb();
  if (!db) throw new Error("Editorial database is unavailable");
  const result = await db.insert(stories).values(input);
  return result[0];
}

export async function updateStory(id: number, input: Partial<InsertStoryRecord>) {
  const db = await getDb();
  if (!db) throw new Error("Editorial database is unavailable");
  await db.update(stories).set(input).where(eq(stories.id, id));
  return getStoryById(id);
}

export async function createMediaInquiry(input: InsertMediaInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Inquiry database is unavailable");
  const result = await db.insert(mediaInquiries).values(input);
  return result[0];
}

export async function listMediaInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mediaInquiries).orderBy(desc(mediaInquiries.createdAt));
}

export async function updateMediaInquiryStatus(id: number, status: "new" | "reviewed" | "contacted") {
  const db = await getDb();
  if (!db) throw new Error("Inquiry database is unavailable");
  await db.update(mediaInquiries).set({ status }).where(eq(mediaInquiries.id, id));
  const result = await db.select().from(mediaInquiries).where(eq(mediaInquiries.id, id)).limit(1);
  return result[0];
}

export async function subscribeReader(input: { email: string; displayName?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Subscriber database is unavailable");
  const email = input.email.toLowerCase().trim();
  const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  if (existing[0]) {
    await db.update(subscribers).set({
      displayName: input.displayName?.trim() || existing[0].displayName,
      status: "subscribed",
      consentAt: new Date(),
      unsubscribedAt: null,
    }).where(eq(subscribers.id, existing[0].id));
    return { subscriberId: existing[0].id, wasNew: false };
  }
  const result = await db.insert(subscribers).values({
    email,
    displayName: input.displayName?.trim() || null,
    unsubscribeToken: randomUUID().replace(/-/g, ""),
    status: "subscribed",
  });
  return { subscriberId: Number(result[0].insertId), wasNew: true };
}

export async function unsubscribeReader(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Subscriber database is unavailable");
  const existing = await db.select().from(subscribers).where(eq(subscribers.unsubscribeToken, token)).limit(1);
  if (!existing[0]) return false;
  await db.update(subscribers).set({ status: "unsubscribed", unsubscribedAt: new Date() }).where(eq(subscribers.id, existing[0].id));
  return true;
}

export async function listSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
}

export async function queuePublishNotifications(storyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Newsletter database is unavailable");
  const activeSubscribers = await db.select().from(subscribers).where(eq(subscribers.status, "subscribed"));
  if (!activeSubscribers.length) return { queued: 0 };
  await db.insert(newsletterDeliveries).values(activeSubscribers.map((subscriber) => ({ storyId, subscriberId: subscriber.id, status: "queued" as const })));
  return { queued: activeSubscribers.length };
}

export async function listNewsletterDeliveries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterDeliveries).orderBy(desc(newsletterDeliveries.createdAt));
}
