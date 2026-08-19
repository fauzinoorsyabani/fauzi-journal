import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createMediaInquiry,
  createStory,
  getStoryById,
  getPublishedStoryBySlug,
  listMediaInquiries,
  listNewsletterDeliveries,
  listPublishedStories,
  listSubscribers,
  listStoriesForEditor,
  queuePublishNotifications,
  subscribeReader,
  unsubscribeReader,
  updateMediaInquiryStatus,
  updateStory,
} from "../editorial";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

const chapterSchema = z.object({
  type: z.enum(["copy", "image", "quote", "split"]),
  eyebrow: z.string().max(180).optional(),
  heading: z.string().max(600).optional(),
  body: z.array(z.string().max(6000)).max(12).optional(),
  quote: z.string().max(1000).optional(),
  attribution: z.string().max(240).optional(),
  image: z.string().max(2000).optional(),
  alt: z.string().max(600).optional(),
  caption: z.string().max(1000).optional(),
  side: z.enum(["left", "right"]).optional(),
});

const storyInputSchema = z.object({
  slug: z.string().min(3).max(160).regex(/^[a-z0-9-]+$/, "Gunakan huruf kecil, angka, dan tanda hubung untuk slug."),
  storyNumber: z.number().int().min(1).max(999),
  category: z.string().min(2).max(72),
  title: z.string().min(8).max(1000),
  cardTitle: z.string().max(220).optional(),
  deck: z.string().min(16).max(2000),
  author: z.string().min(2).max(160),
  readTime: z.string().min(3).max(48),
  accent: z.string().max(160).optional(),
  impact: z.string().max(2000).optional(),
  heroImageUrl: z.string().min(3).max(2000),
  heroImageAlt: z.string().min(3).max(1000),
  heroImagePosition: z.string().max(96).optional(),
  chapters: z.array(chapterSchema).min(1).max(20),
  richContentJson: z.string().max(100_000).optional(),
});

function editorialValues(input: z.infer<typeof storyInputSchema>) {
  return {
    slug: input.slug,
    storyNumber: input.storyNumber,
    category: input.category,
    title: input.title,
    cardTitle: input.cardTitle ?? null,
    deck: input.deck,
    author: input.author,
    readTime: input.readTime,
    accent: input.accent ?? null,
    impact: input.impact ?? null,
    heroImageUrl: input.heroImageUrl,
    heroImageAlt: input.heroImageAlt,
    heroImagePosition: input.heroImagePosition ?? "center",
    chaptersJson: JSON.stringify(input.chapters),
    richContentJson: input.richContentJson ?? null,
  };
}

export const editorialRouter = router({
  publicList: publicProcedure.query(async () => listPublishedStories()),
  publicBySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(160) })).query(async ({ input }) => {
    const story = await getPublishedStoryBySlug(input.slug);
    if (!story || story.status !== "published") return null;
    return story;
  }),
  submitInquiry: publicProcedure.input(z.object({
    fullName: z.string().min(2).max(160),
    email: z.string().email().max(320),
    outlet: z.string().max(220).optional(),
    inquiryType: z.string().min(2).max(96),
    message: z.string().min(16).max(5000),
    sourcePath: z.string().max(320).optional(),
  })).mutation(async ({ input }) => {
    await createMediaInquiry({
      fullName: input.fullName.trim(),
      email: input.email.toLowerCase().trim(),
      outlet: input.outlet?.trim() || null,
      inquiryType: input.inquiryType.trim(),
      message: input.message.trim(),
      sourcePath: input.sourcePath?.trim() || null,
    });
    return { success: true } as const;
  }),
  subscribe: publicProcedure.input(z.object({
    email: z.string().email().max(320),
    displayName: z.string().max(160).optional(),
    consent: z.literal(true),
  })).mutation(async ({ input }) => {
    const result = await subscribeReader(input);
    return { success: true as const, wasNew: result.wasNew };
  }),
  unsubscribe: publicProcedure.input(z.object({ token: z.string().min(24).max(96) })).mutation(async ({ input }) => ({ success: await unsubscribeReader(input.token) })),
  adminList: adminProcedure.query(async () => listStoriesForEditor()),
  adminCreate: adminProcedure.input(storyInputSchema.extend({ status: z.enum(["draft", "published"]).default("draft") })).mutation(async ({ ctx, input }) => {
    try {
      const record = await createStory({
        ...editorialValues(input),
        status: input.status,
        publishedAt: input.status === "published" ? new Date() : null,
        createdBy: ctx.user.id,
      });
      const id = Number(record.insertId);
      const notification = input.status === "published" ? await queuePublishNotifications(id) : { queued: 0 };
      return { id, queuedNotifications: notification.queued };
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug ini sudah digunakan." });
      }
      throw error;
    }
  }),
  adminUpdate: adminProcedure.input(storyInputSchema.extend({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ input }) => {
    const existing = await getStoryById(input.id);
    if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Cerita tidak ditemukan." });
    const updated = await updateStory(input.id, {
      ...editorialValues(input),
      status: input.status,
      publishedAt: input.status === "published" ? (existing.publishedAt ?? new Date()) : null,
    });
    const notification = existing.status === "draft" && input.status === "published" ? await queuePublishNotifications(input.id) : { queued: 0 };
    return { story: updated, queuedNotifications: notification.queued };
  }),
  adminInquiries: adminProcedure.query(async () => listMediaInquiries()),
  adminUpdateInquiryStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "reviewed", "contacted"]) })).mutation(async ({ input }) => updateMediaInquiryStatus(input.id, input.status)),
  adminSubscribers: adminProcedure.query(async () => listSubscribers()),
  adminNewsletterDeliveries: adminProcedure.query(async () => listNewsletterDeliveries()),
  adminUploadImage: adminProcedure.input(z.object({
    filename: z.string().min(1).max(180),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
    dataBase64: z.string().min(32).max(8_500_000),
  })).mutation(async ({ ctx, input }) => {
    const bytes = Buffer.from(input.dataBase64, "base64");
    if (bytes.byteLength > 6_000_000) {
      throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Ukuran gambar maksimal 6 MB." });
    }
    const safeFilename = input.filename.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
    const key = `editorial/${ctx.user.id}/${Date.now()}-${safeFilename}`;
    const uploaded = await storagePut(key, bytes, input.contentType);
    return uploaded;
  }),
});
