/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * The archive is a curated image index with staggered frames, not a conventional card catalogue.
 */
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { StoryCard } from "@/components/StoryCard";
import { usePublishedStories } from "@/lib/editorial";

export default function StoryIndex() {
  const { stories } = usePublishedStories();
  return (
    <main className="bg-[#f3f0ea] pb-16 pt-32 text-[#121110] sm:pb-24 sm:pt-40">
      <section className="page-shell relative">
        <div className="pointer-events-none absolute -top-12 right-[14%] hidden h-48 w-px bg-[#b78a58] lg:block" aria-hidden="true" />
        <div className="border-b border-black/15 pb-9 sm:pb-12">
          <p className="eyebrow mb-5">Fauzi / Journal / Volume 01</p>
          <div className="grid gap-7 lg:grid-cols-[1.2fr_0.55fr] lg:items-end">
            <h1 className="max-w-5xl font-display text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.84] tracking-[-0.06em]">Indeks jurnal</h1>
            <div className="space-y-5">
              <p className="max-w-sm font-sans text-sm leading-relaxed text-[#625e58] sm:text-base">Catatan sederhana tentang kebiasaan, cara berpikir, dan waktu yang kita pilih untuk dijalani dengan lebih sadar.</p>
              <div className="flex max-w-sm items-center justify-between bg-[#080808] px-4 py-3 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#f3f0ea]">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#b78a58]" /> Koordinat jurnal</span>
                <span className="text-[#b78a58]">{String(stories.length).padStart(2, "0")} catatan</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3" aria-hidden="true"><span className="h-[2px] w-12 bg-[#080808]" /><span className="h-[2px] w-5 bg-[#b78a58]" /><span className="h-px flex-1 bg-black/15" /></div>
        </div>

        <div className="grid gap-x-6 gap-y-14 py-14 md:grid-cols-12 md:gap-y-24 lg:gap-x-8 lg:py-20">
          {stories.map((story, index) => {
            const spanClass = index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5 md:pt-24" : index === 2 ? "md:col-span-5 md:mt-[-4rem]" : index === 3 ? "md:col-span-7 md:pt-16" : index === 4 ? "md:col-span-7" : "md:col-span-5 md:pt-28";
            return (
              <div key={story.slug} className={spanClass}>
                <StoryCard story={story} compact={index === 1 || index === 5} priority={index < 2} />
                {index === 0 || index === 3 ? (
                  <div className="mt-5 grid gap-3 border-t border-black/15 pt-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <p className="max-w-md font-sans text-sm leading-relaxed text-[#625e58]">{story.deck}</p>
                    <Link href={`/stories/${story.slug}`} className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#24211e] transition-colors hover:text-[#b78a58]">
                      Baca jurnal <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
