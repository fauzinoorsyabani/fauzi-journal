/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * The homepage reads like a personal field journal: an opening reflection,
 * a compact archive, and quiet invitations to continue the practice.
 */
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";
import { Link } from "wouter";
import { StoryCard } from "@/components/StoryCard";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { usePublishedStories } from "@/lib/editorial";

export default function Home() {
  const { stories } = usePublishedStories();
  const featured = stories[0];
  const storyGrid = stories.slice(1);

  if (!featured) return null;

  return (
    <main>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#080808] pb-8 pt-24 sm:pb-10 lg:pb-14">
        <div className="story-grain absolute inset-0">
          <img src={featured.image} alt={featured.alt} className="h-full w-full object-cover object-[65%_center] brightness-[0.72] saturate-[0.76]" fetchPriority="high" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.52)_42%,rgba(8,8,8,0.07)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.72)_0%,transparent_50%)]" />
        </div>

        <div className="page-shell relative z-10 grid w-full gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,.75fr)] lg:items-end">
          <div className="max-w-4xl">
            <div className="reveal-up mb-6 flex items-center gap-3"><span className="h-px w-9 bg-[#b78a58]" /><p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#e3c29f]">Jurnal pilihan / {featured.accent}</p></div>
            <h1 className="reveal-up-delay max-w-4xl font-display text-[clamp(3.3rem,8.5vw,8.4rem)] leading-[0.83] tracking-[-0.065em] text-[#f8f5ef]">{featured.title}</h1>
          </div>
          <div className="reveal-up-delay-2 max-w-md justify-self-end border-l border-[#b78a58]/75 pl-5 lg:mb-2">
            <p className="font-sans text-sm leading-relaxed text-[#ebe8e1]/88 sm:text-base">{featured.deck}</p>
            <Link href={`/stories/${featured.slug}`} className="link-sightline mt-6">Baca jurnal <ArrowUpRight size={15} className="text-[#b78a58]" /></Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-5 z-10 hidden items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#e6e2db]/70 sm:right-8 md:flex lg:right-12"><span>Gulir untuk masuk</span><ArrowDown size={13} className="text-[#b78a58]" /></div>
      </section>

      <EditorialMarquee />

      <section id="stories" className="bg-[#f3f0ea] py-16 text-[#121110] sm:py-24 lg:py-32">
        <div className="page-shell">
          <div className="mb-12 grid gap-6 border-b border-black/15 pb-7 sm:mb-16 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-9">
            <div><p className="eyebrow mb-4">Indeks jurnal</p><h2 className="max-w-3xl font-display text-[clamp(3rem,5vw,5.25rem)] leading-[0.85] tracking-[-0.06em]">Catatan kecil untuk tumbuh tanpa terburu-buru.</h2></div>
            <Link href="/stories" className="group inline-flex items-center gap-3 font-mono text-[0.63rem] uppercase tracking-[0.16em] text-[#24211e] transition-colors hover:text-[#b78a58]">Jelajahi semua cerita <MoveRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" /></Link>
          </div>
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {storyGrid.map((story, index) => <StoryCard key={story.slug} story={story} compact={index === 1} className={index === 1 ? "md:mt-24" : ""} priority={index === 0} />)}
          </div>
          <div className="mt-14 border-t border-black/15 pt-7 sm:mt-20"><p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#b78a58]">Catatan penulis</p><p className="mt-4 max-w-2xl font-display text-3xl leading-[0.95] tracking-[-0.045em] text-[#1b1917] sm:text-4xl">Tidak ada yang harus langsung rapi. Yang penting, kita memberi diri sendiri alasan untuk kembali mencoba.</p></div>
        </div>
      </section>

      <section id="impact" className="relative overflow-hidden bg-[#11100f] py-20 sm:py-28 lg:py-36">
        <div className="absolute left-[12%] top-0 h-px w-[72%] bg-[#b78a58]/40" />
        <div className="page-shell grid gap-12 lg:grid-cols-[0.48fr_1fr] lg:gap-24">
          <div className="flex flex-col justify-between gap-8"><p className="eyebrow">Ritme yang realistis</p><p className="max-w-[14rem] font-mono text-[0.63rem] leading-relaxed tracking-[0.1em] text-[#aaa59d]">Self-development bukan lomba untuk menjadi versi lain dari diri sendiri.</p></div>
          <div><p className="max-w-5xl font-display text-[clamp(3rem,7.1vw,7rem)] leading-[0.87] tracking-[-0.06em] text-[#f3f0ea]"><span className="text-[#b78a58]">Sedikit demi sedikit,</span> kita belajar memilih yang penting, merawat energi, dan tetap hadir.</p><div className="mt-12 grid gap-5 border-t border-white/15 pt-5 sm:grid-cols-[1fr_auto] sm:items-start"><p className="max-w-xl text-base leading-relaxed text-[#c1bdb5]">Tidak semua hari harus produktif. Namun, satu tindakan kecil yang selaras dengan arah hidup dapat menjaga kita tetap bergerak.</p><Link href={`/stories/${featured.slug}`} className="link-sightline">Mulai membaca <ArrowUpRight size={15} /></Link></div></div>
        </div>
      </section>

      <section id="culture" className="bg-[#080808] py-16 sm:py-24 lg:py-32">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><p className="eyebrow mb-4">Ruang refleksi</p><h2 className="max-w-xl font-display text-[clamp(3rem,5vw,5.25rem)] leading-[0.85] tracking-[-0.06em] text-[#f3f0ea]">Belajar menjaga diri sambil tetap penasaran.</h2></div>
          <div className="border-l border-white/10 pl-5 sm:pl-8"><p className="max-w-2xl font-display text-3xl leading-[0.96] tracking-[-0.045em] text-[#f3f0ea] sm:text-4xl">“Bertumbuh bukan soal selalu percaya diri. Bertumbuh adalah tetap penasaran ketika percaya diri belum datang.”</p><p className="mt-8 max-w-xl text-sm leading-relaxed text-[#a9a59e]">Jurnal ini memadukan refleksi pribadi dengan gagasan dari buku nyata. Baca karya aslinya bila ada bagian yang ingin Anda dalami lebih jauh.</p><Link href="/stories/belajar-tanpa-menunggu-hebat" className="link-sightline mt-8">Baca tentang cara berpikir <ArrowUpRight size={15} /></Link></div>
        </div>
      </section>
    </main>
  );
}
