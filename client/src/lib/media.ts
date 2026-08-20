/**
 * Portable editorial image references.
 * Set VITE_PUBLIC_MEDIA_BASE_URL to the public root of a Vercel Blob store and
 * upload the files under the fauzi-journal/ prefix. Independent fallback URLs
 * preserve the public layout before a Blob store is connected.
 */
type MediaAsset = "hero" | "people" | "impact" | "bts" | "mark";

const files: Record<MediaAsset, string> = {
  hero: "fauzi-journal/lensstories-hero.jpg",
  people: "fauzi-journal/lensstories-people.jpg",
  impact: "fauzi-journal/lensstories-impact.jpg",
  bts: "fauzi-journal/lensstories-bts.jpg",
  mark: "fauzi-journal/lensstories-mark.png",
};

const fallback: Record<MediaAsset, string> = {
  hero: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=88",
  people: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=88",
  impact: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=88",
  bts: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=88",
  mark: "/favicon.svg",
};

const mediaBase = (import.meta.env.VITE_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

export const editorialMedia: Record<MediaAsset, string> = Object.fromEntries(
  (Object.keys(files) as MediaAsset[]).map((key) => [key, mediaBase ? `${mediaBase}/${files[key]}` : fallback[key]]),
) as Record<MediaAsset, string>;
