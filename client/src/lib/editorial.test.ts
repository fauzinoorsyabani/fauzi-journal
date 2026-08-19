import { describe, expect, it } from "vitest";
import { mapPublishedRecord } from "./editorial";

describe("mapPublishedRecord", () => {
  it("maps a published CMS record into the public story contract with parsed chapters", () => {
    const story = mapPublishedRecord({
      slug: "a-test-note",
      storyNumber: 7,
      category: "Field Notes",
      title: "A test note in the archive",
      cardTitle: null,
      deck: "A short editorial deck that is deliberately long enough for the schema.",
      author: "Fauzi",
      readTime: "04 min read",
      accent: "Studio note",
      impact: "A detail worth retaining.",
      heroImageUrl: "/manus-storage/story.jpg",
      heroImageAlt: "A descriptive editorial image.",
      heroImagePosition: "center",
      chaptersJson: JSON.stringify([{ type: "copy", heading: "A chapter", body: ["A paragraph."] }]),
      publishedAt: new Date("2026-08-19T00:00:00.000Z"),
      createdAt: new Date("2026-08-18T00:00:00.000Z"),
    });

    expect(story.index).toBe("07");
    expect(story.slug).toBe("a-test-note");
    expect(story.chapters).toEqual([{ type: "copy", heading: "A chapter", body: ["A paragraph."] }]);
    expect(story.image).toBe("/manus-storage/story.jpg");
  });

  it("keeps malformed chapter payloads from breaking the public story page", () => {
    const story = mapPublishedRecord({
      slug: "invalid-chapters",
      storyNumber: 8,
      category: "Culture",
      title: "An invalid payload should remain readable",
      cardTitle: "Invalid payload",
      deck: "A fallback story record with a malformed chapter payload.",
      author: "Fauzi",
      readTime: "03 min read",
      accent: null,
      impact: null,
      heroImageUrl: "/manus-storage/story.jpg",
      heroImageAlt: "A descriptive editorial image.",
      heroImagePosition: null,
      chaptersJson: "not-json",
      publishedAt: null,
      createdAt: new Date("2026-08-18T00:00:00.000Z"),
    });

    expect(story.chapters).toEqual([]);
    expect(story.accent).toBe("Fauzi / Journal");
  });
});
