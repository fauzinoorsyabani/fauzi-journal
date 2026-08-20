import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../editorial", () => ({
  createMediaInquiry: vi.fn(),
  createStory: vi.fn(),
  getPublishedStoryBySlug: vi.fn(),
  getStoryById: vi.fn(),
  listMediaInquiries: vi.fn(),
  listNewsletterDeliveries: vi.fn(),
  listPublishedStories: vi.fn(),
  listSubscribers: vi.fn(),
  listStoriesForEditor: vi.fn(),
  queuePublishNotifications: vi.fn(),
  subscribeReader: vi.fn(),
  unsubscribeReader: vi.fn(),
  updateMediaInquiryStatus: vi.fn(),
  updateStory: vi.fn(),
}));

import { createMediaInquiry, subscribeReader, unsubscribeReader } from "../editorial";
import { editorialRouter } from "./editorial";

const caller = editorialRouter.createCaller({} as never);

describe("public editorial form validation", () => {
  beforeEach(() => {
    delete process.env.FORM_DRY_RUN;
    vi.clearAllMocks();
  });

  it("rejects an invalid inquiry before a lead can be persisted", async () => {
    await expect(caller.submitInquiry({
      fullName: "A",
      email: "not-an-email",
      inquiryType: "P",
      message: "short",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(createMediaInquiry).not.toHaveBeenCalled();
  });

  it("requires explicit consent before a subscriber mutation can run", async () => {
    await expect(caller.subscribe({
      email: "reader@example.com",
      consent: false,
    } as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(subscribeReader).not.toHaveBeenCalled();
  });

  it("rejects a short unsubscribe token before subscriber state can change", async () => {
    await expect(caller.unsubscribe({ token: "too-short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    expect(unsubscribeReader).not.toHaveBeenCalled();
  });

  it("routes valid public form submissions to their persistence services without using Production data", async () => {
    vi.mocked(createMediaInquiry).mockResolvedValue(undefined);
    vi.mocked(subscribeReader).mockResolvedValue({ wasNew: true });
    vi.mocked(unsubscribeReader).mockResolvedValue(true);

    await expect(caller.submitInquiry({
      fullName: "Mock Editor",
      email: "editor@example.com",
      inquiryType: "Press request",
      message: "Please share the upcoming editorial release details.",
      sourcePath: "/stories/the-quiet-shift",
    })).resolves.toEqual({ success: true, dryRun: false });
    await expect(caller.subscribe({ email: "reader@example.com", consent: true })).resolves.toEqual({ success: true, wasNew: true, dryRun: false });
    await expect(caller.unsubscribe({ token: "a".repeat(24) })).resolves.toEqual({ success: true, dryRun: false });

    expect(createMediaInquiry).toHaveBeenCalledTimes(1);
    expect(subscribeReader).toHaveBeenCalledWith({ email: "reader@example.com", consent: true });
    expect(unsubscribeReader).toHaveBeenCalledWith("a".repeat(24));
  });

  it("returns success without invoking persistence when FORM_DRY_RUN is enabled", async () => {
    process.env.FORM_DRY_RUN = "true";

    await expect(caller.submitInquiry({
      fullName: "Dry Run Editor",
      email: "dry-run@example.com",
      inquiryType: "Press request",
      message: "This message is accepted without database persistence.",
    })).resolves.toEqual({ success: true, dryRun: true });
    await expect(caller.subscribe({ email: "dry-run-reader@example.com", consent: true })).resolves.toEqual({ success: true, wasNew: false, dryRun: true });
    await expect(caller.unsubscribe({ token: "b".repeat(24) })).resolves.toEqual({ success: true, dryRun: true });

    expect(createMediaInquiry).not.toHaveBeenCalled();
    expect(subscribeReader).not.toHaveBeenCalled();
    expect(unsubscribeReader).not.toHaveBeenCalled();
  });
});
