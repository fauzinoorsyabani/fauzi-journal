import { useEffect, useRef, useState } from "react";

export type ChapterDraft = {
  type: "copy" | "split" | "image" | "quote";
  eyebrow: string;
  heading: string;
  body: string;
  quote: string;
  attribution: string;
  image: string;
  alt: string;
  caption: string;
  side: "left" | "right";
};


export type StoryDraft = {
  slug: string;
  storyNumber: number;
  category: string;
  title: string;
  cardTitle: string;
  deck: string;
  author: string;
  readTime: string;
  accent: string;
  impact: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroImagePosition: string;
  status: "draft" | "published";
  chapters: ChapterDraft[];
  richContentJson: string;
};

export const blankChapter = (): ChapterDraft => ({
  type: "copy",
  eyebrow: "",
  heading: "",
  body: "",
  quote: "",
  attribution: "",
  image: "",
  alt: "",
  caption: "",
  side: "right",
});

export const blankStory = (authorName = "Penulis"): StoryDraft => ({
  slug: "",
  storyNumber: 1,
  category: "Catatan Lapangan",
  title: "",
  cardTitle: "",
  deck: "",
  author: authorName,
  readTime: "05 menit baca",
  accent: "Fauzi / Journal",
  impact: "",
  heroImageUrl: "",
  heroImageAlt: "",
  heroImagePosition: "center",
  status: "draft",
  chapters: [blankChapter()],
  richContentJson: "",
});

export const statusLabel = (status: string) =>
  ({
    draft: "Draf",
    published: "Diterbitkan",
    subscribed: "Berlangganan",
    unsubscribed: "Berhenti berlangganan",
    queued: "Menunggu kirim",
    new: "Baru",
    reviewed: "Ditinjau",
    contacted: "Dihubungi",
  }[status] ?? status);

export function parseChapters(raw: string): ChapterDraft[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length
      ? parsed.map((chapter) => ({
          ...blankChapter(),
          ...chapter,
          body: Array.isArray(chapter.body) ? chapter.body.join("\n\n") : chapter.body ?? "",
        }))
      : [blankChapter()];
  } catch {
    return [blankChapter()];
  }
}

export function recordToDraft(record: any): StoryDraft {
  return {
    slug: record.slug,
    storyNumber: record.storyNumber,
    category: record.category,
    title: record.title,
    cardTitle: record.cardTitle ?? "",
    deck: record.deck,
    author: record.author,
    readTime: record.readTime,
    accent: record.accent ?? "",
    impact: record.impact ?? "",
    heroImageUrl: record.heroImageUrl,
    heroImageAlt: record.heroImageAlt,
    heroImagePosition: record.heroImagePosition ?? "center",
    status: record.status,
    chapters: parseChapters(record.chaptersJson),
    richContentJson: record.richContentJson ?? "",
  };
}

const LOCAL_STORAGE_KEY = "fauzi_journal_story_draft";

export function useStoryDraft({
  editingRecord,
  authorFallback = "Penulis",
}: {
  editingRecord: any | null;
  authorFallback?: string;
}) {
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [draft, setDraft] = useState<StoryDraft>(() => {
    // If editing existing database story, always prioritize database record
    if (editingRecord) {
      return recordToDraft(editingRecord);
    }

    // If new story, try to recover unfinished draft from LocalStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.title || parsed.deck || parsed.richContentJson || parsed.heroImageUrl)) {
          return { ...blankStory(authorFallback), ...parsed };
        }
      }
    } catch (err) {
      console.warn("[Draft] Failed to recover local draft:", err);
    }

    return blankStory(authorFallback);
  });

  // Track initial mount to announce restoration once
  useEffect(() => {
    if (!editingRecord) {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.title || parsed.deck || parsed.richContentJson)) {
            setHasRestoredDraft(true);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [editingRecord]);

  // Sync state if editingRecord changes
  useEffect(() => {
    if (editingRecord) {
      setDraft(recordToDraft(editingRecord));
    }
  }, [editingRecord]);

  // Debounced auto-save to LocalStorage for new drafts
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Don't overwrite new draft storage when editing existing archived record
    if (editingRecord) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      try {
        const hasContent = Boolean(
          draft.title.trim() ||
            draft.deck.trim() ||
            draft.richContentJson.trim() ||
            draft.heroImageUrl.trim()
        );
        if (hasContent) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
          setLastSavedAt(new Date());
        }
      } catch (err) {
        console.warn("[Draft] LocalStorage write error:", err);
      }
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [draft, editingRecord]);

  const clearStorageDraft = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setHasRestoredDraft(false);
      setLastSavedAt(null);
    } catch {
      // ignore
    }
  };

  const resetDraft = () => {
    clearStorageDraft();
    setDraft(blankStory(authorFallback));
  };

  return {
    draft,
    setDraft,
    resetDraft,
    clearStorageDraft,
    hasRestoredDraft,
    setHasRestoredDraft,
    lastSavedAt,
  };
}
