import { describe, expect, it } from "vitest";
import { stories } from "./stories";

describe("seri self-development", () => {
  it("menyediakan tiga jurnal dengan rujukan buku dan highlight refleksi", () => {
    expect(stories).toHaveLength(3);
    for (const story of stories) {
      expect(story.references?.[0]?.title).toBeTruthy();
      expect(story.references?.[0]?.author).toBeTruthy();
      expect(story.references?.[0]?.url).toMatch(/^https:\/\//);
      expect(story.chapters.some((chapter) => Boolean(chapter.highlight))).toBe(true);
    }
  });

  it("menempatkan foto personal sebagai visual pendukung yang tidak lebar", () => {
    const personalPhotoChapters = stories.flatMap((story) => story.chapters).filter((chapter) => chapter.image?.startsWith("https://gwst4iapywswxoyh.public.blob.vercel-storage.com/"));

    expect(personalPhotoChapters).toHaveLength(5);
    expect(personalPhotoChapters.every((chapter) => chapter.imageSize !== "wide")).toBe(true);
  });
});
