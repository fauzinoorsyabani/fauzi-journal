/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * Story pages use a cinematic sequence: full-bleed frames, quiet copy rails, and gallery-label captions.
 */
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import type { Story, StoryChapter } from "@/data/stories";
import { getStory } from "@/data/stories";
import { mapPublishedRecord, usePublishedStories } from "@/lib/editorial";
import { trpc } from "@/lib/trpc";
import { ParallaxImage, Reveal } from "@/components/ScrollMotion";
import { RichJournalContent } from "@/components/RichJournalContent";

function StoryChapterBlock({ chapter }: { chapter: StoryChapter }) {
  if (chapter.type === "image" && chapter.image) {
    const imageWidth = chapter.imageSize === "small" ? "max-w-md" : chapter.imageSize === "medium" ? "max-w-3xl" : "max-w-[1500px]";
    const imageAspect = chapter.imageSize === "small" || chapter.imageSize === "medium" ? "aspect-[4/5]" : "aspect-[16/10]";
    return (
      <section className="my-16 sm:my-24 lg:my-32">
        <ParallaxImage src={chapter.image} alt={chapter.alt ?? "Gambar cerita"} className={`story-grain mx-auto ${imageAspect} w-full ${imageWidth} bg-[#151515]`} imageClassName="brightness-[0.86] saturate-[0.82]" loading="eager" />
        {chapter.caption ? (
          <div className={`mx-auto mt-3 flex w-full ${imageWidth} justify-end px-5 sm:px-0`}>
            <p className="max-w-sm font-mono text-[0.58rem] leading-relaxed tracking-[0.1em] text-[#89857e]">{chapter.caption}</p>
          </div>
        ) : null}
      </section>
    );
  }

  if (chapter.type === "quote" && chapter.quote) {
    return (
      <section className="my-16 border-y border-white/10 py-14 sm:my-24 sm:py-20 lg:my-32 lg:py-28">
        <div className="page-shell grid gap-8 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <Reveal><p className="eyebrow flex items-center gap-3"><span className="h-px w-6 bg-[#b78a58]" />Catatan dari karya</p></Reveal>
          <Reveal delay="short">
            <blockquote className="max-w-5xl font-display text-[clamp(2.15rem,4.5vw,4.6rem)] leading-[0.92] tracking-[-0.055em] text-[#f3f0ea]">“{chapter.quote}”</blockquote>
            {chapter.attribution ? <cite className="mt-7 block font-mono text-[0.62rem] not-italic uppercase tracking-[0.14em] text-[#b78a58]">{chapter.attribution}</cite> : null}
          </Reveal>
        </div>
      </section>
    );
  }

  if (chapter.type === "split" && chapter.image) {
    const imageFirst = chapter.side === "left";
    return (
      <section className="my-16 sm:my-24 lg:my-32">
        <div className="page-shell grid gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className={`${imageFirst ? "lg:order-1" : "lg:order-2"}`}>
            <ParallaxImage src={chapter.image} alt={chapter.alt ?? "Gambar cerita"} className="story-grain aspect-[4/5] bg-[#141414]" imageClassName="brightness-[0.83] saturate-[0.8]" loading="eager" />
            {chapter.caption ? <p className="mt-3 font-mono text-[0.58rem] leading-relaxed tracking-[0.09em] text-[#89857e]">{chapter.caption}</p> : null}
          </div>
          <Reveal delay="short" className={`flex flex-col justify-center ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
            {chapter.eyebrow ? <p className="eyebrow mb-5">{chapter.eyebrow}</p> : null}
            {chapter.heading ? <h2 className="max-w-lg font-display text-[clamp(2.2rem,3.8vw,4.1rem)] leading-[0.92] tracking-[-0.05em] text-[#f3f0ea]">{chapter.heading}</h2> : null}
            {chapter.highlight ? <p className="mt-7 max-w-lg border-l-2 border-[#b78a58] bg-[#b78a58]/10 px-5 py-4 font-display text-2xl leading-tight tracking-[-0.035em] text-[#f0d4ad]">{chapter.highlight}</p> : null}
            <div className="mt-7 max-w-lg space-y-5 text-[0.98rem] leading-8 text-[#bdb9b1] sm:text-lg sm:leading-8">
              {chapter.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16 sm:my-24 lg:my-32">
      <div className="page-shell grid gap-9 lg:grid-cols-[0.48fr_1fr] lg:gap-20">
        <Reveal><div>{chapter.eyebrow ? <p className="eyebrow">{chapter.eyebrow}</p> : null}</div></Reveal>
        <Reveal delay="short">
          {chapter.heading ? <h2 className="max-w-4xl font-display text-[clamp(2.3rem,4.1vw,4.45rem)] leading-[0.9] tracking-[-0.052em] text-[#f3f0ea]">{chapter.heading}</h2> : null}
          {chapter.highlight ? <p className="mt-8 max-w-2xl border-l-2 border-[#b78a58] bg-[#b78a58]/10 px-5 py-4 font-display text-2xl leading-tight tracking-[-0.035em] text-[#f0d4ad] sm:text-3xl">{chapter.highlight}</p> : null}
          <div className="mt-9 max-w-2xl space-y-6 text-[1rem] leading-8 text-[#bdb9b1] sm:text-lg sm:leading-9">
            {chapter.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MissingStory() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#080808] px-5 pt-24 text-center text-[#f3f0ea]">
      <div>
        <p className="eyebrow">Cerita tidak tersedia</p>
        <h1 className="mt-5 font-display text-5xl tracking-[-0.06em] sm:text-7xl">Bingkai ini kosong.</h1>
        <Link href="/stories" className="link-sightline mt-8">Kembali ke indeks cerita <ArrowLeft size={15} /></Link>
      </div>
    </main>
  );
}

function StoryNavigation({ story, stories }: { story: Story; stories: Story[] }) {
  const currentIndex = stories.findIndex((item) => item.slug === story.slug);
  const previous = stories[(currentIndex - 1 + stories.length) % stories.length];
  const next = stories[(currentIndex + 1) % stories.length];

  return (
    <section className="border-t border-white/10 bg-[#0d0d0d] py-16 sm:py-20 lg:py-24">
      <div className="page-shell">
        <p className="eyebrow mb-8">Lanjut membaca</p>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <Link href={`/stories/${previous.slug}`} className="group border-t border-white/15 pt-5">
            <div className="mb-4 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#9d9992]"><ArrowLeft size={14} className="text-[#b78a58]" /> Cerita sebelumnya</div>
            <p className="max-w-lg font-display text-3xl leading-[0.93] tracking-[-0.05em] text-[#f3f0ea] transition-colors group-hover:text-[#b78a58] sm:text-4xl">{previous.cardTitle}</p>
          </Link>
          <Link href={`/stories/${next.slug}`} className="group border-t border-white/15 pt-5 md:text-right">
            <div className="mb-4 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#9d9992] md:justify-end">Cerita berikutnya <ArrowRight size={14} className="text-[#b78a58]" /></div>
            <p className="ml-auto max-w-lg font-display text-3xl leading-[0.93] tracking-[-0.05em] text-[#f3f0ea] transition-colors group-hover:text-[#b78a58] sm:text-4xl">{next.cardTitle}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function StoryPage() {
  const [, params] = useRoute("/stories/:slug");
  const { stories } = usePublishedStories();
  const record = trpc.editorial.publicBySlug.useQuery({ slug: params?.slug ?? "" });
  const story = record.data ? mapPublishedRecord(record.data) : getStory(params?.slug ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.slug]);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  if (!story) return <MissingStory />;

  return (
    <main className="bg-[#080808] pt-[4.75rem] text-[#f3f0ea]">
      <div className="fixed left-0 right-0 top-[4.7rem] z-40 h-px bg-white/10" aria-hidden="true">
        <div className="h-full bg-[#b78a58] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <section className="relative isolate min-h-[calc(100svh-4.75rem)] overflow-hidden">
        <div className="absolute inset-0">
          <ParallaxImage src={story.image} alt={story.alt} className="story-grain h-full w-full" imageClassName="brightness-[0.64] saturate-[0.75]" imageStyle={{ objectPosition: story.imagePosition ?? "center" }} fetchPriority="high" loading="eager" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,.94)_0%,rgba(8,8,8,.63)_46%,rgba(8,8,8,.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,.85)_0%,transparent_56%)]" />
        </div>
        <div className="page-shell relative z-10 flex min-h-[calc(100svh-4.75rem)] flex-col justify-end pb-10 pt-16 sm:pb-14 lg:pb-16">
          <Link href="/stories" className="mb-auto inline-flex w-fit items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#ddd8d1]/80 transition-colors hover:text-[#b78a58]"><ArrowLeft size={14} /> Kembali ke indeks</Link>
          <div className="max-w-6xl">
            <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#e0b98d]">
              <span>{story.index} / {String(stories.length).padStart(2, "0")}</span><span className="h-1 w-1 rounded-full bg-[#b78a58]" /><span>{story.category}</span><span className="h-1 w-1 rounded-full bg-[#b78a58]" /><span>{story.date}</span>
            </div>
            <h1 className="max-w-6xl font-display text-[clamp(2.85rem,6.6vw,6.7rem)] leading-[0.85] tracking-[-0.06em] text-[#f8f5ef]">{story.title}</h1>
            <div className="mt-8 grid max-w-4xl gap-5 border-t border-white/20 pt-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <p className="max-w-2xl font-sans text-base leading-relaxed text-[#d8d4cd] sm:text-lg">{story.deck}</p>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#aaa69f]">Ditulis oleh {story.author} · {story.readTime}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0d0d] py-9 sm:py-12">
        <div className="page-shell grid gap-6 sm:grid-cols-[0.42fr_1fr] sm:items-start">
          <p className="eyebrow">Koordinat cerita</p>
          <p className="max-w-3xl font-display text-3xl leading-[0.97] tracking-[-0.045em] text-[#e8e4dd] sm:text-4xl">{story.impact}</p>
        </div>
      </section>

      {story.richContentJson ? (
        <section className="bg-[#080808] py-16 sm:py-24 lg:py-32">
          <div className="page-shell"><RichJournalContent content={story.richContentJson} /></div>
        </section>
      ) : story.chapters.map((chapter, index) => <StoryChapterBlock chapter={chapter} key={`${story.slug}-${index}`} />)}

      {story.references?.length ? (
        <section className="border-t border-white/10 bg-[#0d0d0d] py-12 sm:py-16">
          <div className="page-shell grid gap-6 sm:grid-cols-[0.42fr_1fr] sm:items-start">
            <p className="eyebrow">Bacaan yang dirujuk</p>
            <div className="max-w-2xl space-y-3">
              {story.references.map((reference) => <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-5 border-b border-white/10 pb-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#d8d4cd] transition-colors hover:text-[#b78a58]"><span><span className="text-[#b78a58]">{reference.title}</span> · {reference.author}</span><ArrowUpRight size={15} className="shrink-0" /></a>)}
              <p className="pt-2 text-xs leading-relaxed text-[#89857e]">Gagasan buku diolah sebagai refleksi pribadi dan parafrase; tulisan ini bukan ringkasan pengganti karya aslinya.</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#121110] py-14 sm:py-20">
        <div className="page-shell grid gap-8 lg:grid-cols-[0.56fr_1fr] lg:gap-20">
          <div><p className="eyebrow">Ruang setelah membaca</p></div>
          <div>
            <p className="max-w-3xl font-display text-[clamp(2.3rem,3.9vw,4.25rem)] leading-[0.92] tracking-[-0.05em] text-[#f3f0ea]">Tidak semua hal harus langsung dipahami untuk tetap memberi arah.</p>
            <div className="mt-9 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-xl text-sm leading-relaxed text-[#aaa69f]">Simpan satu kalimat yang terasa dekat, lalu biarkan ia bekerja perlahan di hari-hari berikutnya. Tidak perlu terburu-buru membuatnya menjadi jawaban.</p>
              <Link href="/stories" className="link-sightline">Baca jurnal lain <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <StoryNavigation story={story} stories={stories} />
    </main>
  );
}
