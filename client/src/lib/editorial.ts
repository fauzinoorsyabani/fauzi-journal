import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { stories as fallbackStories, type Story, type StoryChapter } from "@/data/stories";

type PublishedRecord = {
  slug: string;
  storyNumber: number;
  category: string;
  title: string;
  cardTitle: string | null;
  deck: string;
  author: string;
  readTime: string;
  accent: string | null;
  impact: string | null;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImagePosition: string | null;
  chaptersJson: string;
  richContentJson: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

function safeChapters(raw: string): StoryChapter[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as StoryChapter[] : [];
  } catch {
    return [];
  }
}

export function mapPublishedRecord(record: PublishedRecord): Story {
  const date = record.publishedAt ?? record.createdAt;
  return {
    slug: record.slug,
    index: String(record.storyNumber).padStart(2, "0"),
    category: record.category,
    title: record.title,
    cardTitle: record.cardTitle ?? undefined,
    deck: record.deck,
    date: date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    readTime: record.readTime,
    author: record.author,
    image: record.heroImageUrl,
    alt: record.heroImageAlt,
    imagePosition: record.heroImagePosition ?? "center",
    accent: record.accent ?? "Fauzi / Journal",
    impact: record.impact ?? "A new note in the everyday archive.",
    chapters: safeChapters(record.chaptersJson),
    richContentJson: record.richContentJson,
  };
}

export function usePublishedStories() {
  const query = trpc.editorial.publicList.useQuery();
  const stories = useMemo(() => {
    const cmsStories = (query.data ?? []).map((record) => mapPublishedRecord(record as PublishedRecord));
    const cmsSlugs = new Set(cmsStories.map((story) => story.slug));
    return [...cmsStories, ...fallbackStories.filter((story) => !cmsSlugs.has(story.slug))];
  }, [query.data]);
  return { ...query, stories };
}
