import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  canActorMutateStory,
  createMediaInquiry,
  createStory,
  deleteStory,
  getStoryById,
  getPublishedStoryBySlug,
  listMediaInquiries,
  listNewsletterDeliveries,
  listPublishedStories,
  listSubscribers,
  listStoriesForEditor,
  listStoriesByUserId,
  queuePublishNotifications,
  subscribeReader,
  unsubscribeReader,
  updateMediaInquiryStatus,
  updateStory,
} from "../editorial.js";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc.js";
import { storagePut } from "../storage.js";


const chapterSchema = z.object({
  type: z.enum(["copy", "image", "quote", "split"]),
  eyebrow: z.string().max(180).optional(),
  heading: z.string().max(600).optional(),
  body: z.array(z.string().max(6000)).max(12).optional(),
  quote: z.string().max(1000).optional(),
  attribution: z.string().max(240).optional(),
  image: z.string().max(10_000_000).optional(),
  alt: z.string().max(600).optional(),
  caption: z.string().max(1000).optional(),
  side: z.enum(["left", "right"]).optional(),
});

const storyInputSchema = z.object({
  slug: z.string().min(3).max(160).regex(/^[a-z0-9-]+$/, "Gunakan huruf kecil, angka, dan tanda hubung untuk slug."),
  storyNumber: z.number().int().min(1).max(999).optional().default(1),
  category: z.string().min(2).max(72),
  title: z.string().min(4).max(1000),
  cardTitle: z.string().max(220).optional(),
  deck: z.string().min(10).max(2000),
  author: z.string().min(2).max(160).optional(),
  readTime: z.string().min(3).max(48).optional().default("05 menit baca"),
  accent: z.string().max(160).optional(),
  impact: z.string().max(2000).optional(),
  heroImageUrl: z.string().min(3).max(10_000_000),
  heroImageAlt: z.string().min(3).max(1000),
  heroImagePosition: z.string().max(96).optional(),
  chapters: z.array(chapterSchema).min(1).max(20),
  richContentJson: z.string().max(10_000_000).optional(),
});

function editorialValues(input: z.infer<typeof storyInputSchema>, authorFallback: string = "Penulis", avatarUrlFallback: string | null = null) {
  return {
    slug: input.slug,
    storyNumber: input.storyNumber ?? 1,
    category: input.category,
    title: input.title,
    cardTitle: input.cardTitle ?? null,
    deck: input.deck,
    author: input.author || authorFallback,
    authorAvatarUrl: avatarUrlFallback,
    readTime: input.readTime ?? "05 menit baca",
    accent: input.accent ?? null,
    impact: input.impact ?? null,
    heroImageUrl: input.heroImageUrl,
    heroImageAlt: input.heroImageAlt,
    heroImagePosition: input.heroImagePosition ?? "center",
    chaptersJson: JSON.stringify(input.chapters),
    richContentJson: input.richContentJson ?? null,
  };
}

function isPublicFormDryRun() {
  return process.env.FORM_DRY_RUN === "true";
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
    if (isPublicFormDryRun()) return { success: true as const, dryRun: true as const };
    await createMediaInquiry({
      fullName: input.fullName.trim(),
      email: input.email.toLowerCase().trim(),
      outlet: input.outlet?.trim() || null,
      inquiryType: input.inquiryType.trim(),
      message: input.message.trim(),
      sourcePath: input.sourcePath?.trim() || null,
    });
    return { success: true as const, dryRun: false as const };
  }),
  subscribe: publicProcedure.input(z.object({
    email: z.string().email().max(320),
    displayName: z.string().max(160).optional(),
    consent: z.literal(true),
  })).mutation(async ({ input }) => {
    if (isPublicFormDryRun()) return { success: true as const, wasNew: false, dryRun: true as const };
    const result = await subscribeReader(input);
    return { success: true as const, wasNew: result.wasNew, dryRun: false as const };
  }),
  unsubscribe: publicProcedure.input(z.object({ token: z.string().min(24).max(96) })).mutation(async ({ input }) => {
    if (isPublicFormDryRun()) return { success: true as const, dryRun: true as const };
    return { success: await unsubscribeReader(input.token), dryRun: false as const };
  }),

  // User-facing author procedures (accessible to any logged-in author)
  myStories: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "admin") {
      return listStoriesForEditor();
    }
    return listStoriesByUserId(ctx.user.id);
  }),
  createStory: protectedProcedure.input(storyInputSchema.extend({ status: z.enum(["draft", "published"]).default("draft") })).mutation(async ({ ctx, input }) => {
    try {
      const authorName = ctx.user.name || input.author || "Penulis";
      const record = await createStory({
        ...editorialValues(input, authorName, ctx.user.avatarUrl),
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
  updateStory: protectedProcedure.input(storyInputSchema.extend({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ ctx, input }) => {
    const existing = await getStoryById(input.id);
    if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Cerita tidak ditemukan." });

    if (!canActorMutateStory(existing, ctx.user)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Anda hanya dapat menyunting cerita karya Anda sendiri." });
    }

    const authorName = input.author || existing.author || ctx.user.name || "Penulis";
    const updated = await updateStory(input.id, {
      ...editorialValues(input, authorName, existing.authorAvatarUrl || ctx.user.avatarUrl),
      status: input.status,
      publishedAt: input.status === "published" ? (existing.publishedAt ?? new Date()) : null,
    });
    const notification = existing.status === "draft" && input.status === "published" ? await queuePublishNotifications(input.id) : { queued: 0 };
    return { story: updated, queuedNotifications: notification.queued };
  }),
  deleteStory: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const existing = await getStoryById(input.id);
    if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Cerita tidak ditemukan." });

    if (!canActorMutateStory(existing, ctx.user)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Anda hanya dapat menghapus cerita karya Anda sendiri." });
    }

    await deleteStory(input.id);
    return { success: true };
  }),

  uploadImage: protectedProcedure.input(z.object({
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

  // Legacy/Admin procedures maintained for backward compatibility
  adminList: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "admin") return listStoriesForEditor();
    return listStoriesByUserId(ctx.user.id);
  }),
  adminCreate: protectedProcedure.input(storyInputSchema.extend({ status: z.enum(["draft", "published"]).default("draft") })).mutation(async ({ ctx, input }) => {
    const authorName = ctx.user.name || input.author || "Penulis";
    const record = await createStory({
      ...editorialValues(input, authorName, ctx.user.avatarUrl),
      status: input.status,
      publishedAt: input.status === "published" ? new Date() : null,
      createdBy: ctx.user.id,
    });
    const id = Number(record.insertId);
    const notification = input.status === "published" ? await queuePublishNotifications(id) : { queued: 0 };
    return { id, queuedNotifications: notification.queued };
  }),
  adminUpdate: protectedProcedure.input(storyInputSchema.extend({ id: z.number().int().positive(), status: z.enum(["draft", "published"]) })).mutation(async ({ ctx, input }) => {
    const existing = await getStoryById(input.id);
    if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Cerita tidak ditemukan." });
    if (existing.createdBy !== ctx.user.id && ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Anda hanya dapat menyunting cerita karya Anda sendiri." });
    }
    const updated = await updateStory(input.id, {
      ...editorialValues(input, input.author || existing.author, existing.authorAvatarUrl || ctx.user.avatarUrl),
      status: input.status,
      publishedAt: input.status === "published" ? (existing.publishedAt ?? new Date()) : null,
    });
    const notification = existing.status === "draft" && input.status === "published" ? await queuePublishNotifications(input.id) : { queued: 0 };
    return { story: updated, queuedNotifications: notification.queued };
  }),
  adminUploadImage: protectedProcedure.input(z.object({
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
    return storagePut(key, bytes, input.contentType);
  }),

  // Admin-only procedures for private data
  adminInquiries: adminProcedure.query(async () => listMediaInquiries()),
  adminUpdateInquiryStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "reviewed", "contacted"]) })).mutation(async ({ input }) => updateMediaInquiryStatus(input.id, input.status)),
  adminSubscribers: adminProcedure.query(async () => listSubscribers()),
  adminNewsletterDeliveries: adminProcedure.query(async () => listNewsletterDeliveries()),
});
