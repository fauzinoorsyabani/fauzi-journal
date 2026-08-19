/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * Story cards are image frames with gallery-label metadata, never generic rounded cards.
 */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { Story } from "@/data/stories";

type StoryCardProps = {
  story: Story;
  className?: string;
  priority?: boolean;
  compact?: boolean;
};

export function StoryCard({ story, className = "", priority = false, compact = false }: StoryCardProps) {
  return (
    <article className={`group min-w-0 ${className}`}>
      <Link href={`/stories/${story.slug}`} className="block">
        <div className={`story-grain relative overflow-hidden bg-[#141414] ${compact ? "aspect-[1.14/1]" : "aspect-[4/5]"}`}>
          <img
            src={story.image}
            alt={story.alt}
            className="h-full w-full object-cover brightness-[0.82] saturate-[0.82] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.045] group-hover:brightness-[0.94]"
            style={{ objectPosition: story.imagePosition ?? "center" }}
            loading={priority ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 top-0 z-[3] flex items-start justify-between p-4 sm:p-5">
            <span className="font-mono text-[0.6rem] tracking-[0.16em] text-[#f3f0ea]/82">{story.index} / 06</span>
            <span className="border border-white/25 bg-black/20 px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#f3f0ea]/85 backdrop-blur-sm">{story.category}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-[3] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between border-t border-white/20 pt-3 font-mono text-[0.56rem] uppercase tracking-[0.13em] text-[#d6d2cb]/75">
              <span>{story.date.replace(", 2026", "")}</span>
              <ArrowUpRight size={15} className="text-[#b78a58] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <h3 className={`font-display leading-[0.96] text-[#f8f5ef] ${compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}>
              {story.cardTitle ?? story.title}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  );
}
