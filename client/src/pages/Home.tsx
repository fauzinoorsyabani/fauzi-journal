/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * The homepage reads like a curated film strip: a large opening frame followed by asymmetric story frames.
 */
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";
import { Link } from "wouter";
import { StoryCard } from "@/components/StoryCard";
import { EditorialMarquee } from "@/components/EditorialMarquee";
import { usePublishedStories } from "@/lib/editorial";
import { editorialMedia } from "@/lib/media";

export default function Home() {
  const { stories } = usePublishedStories();
  const featured = stories[0];
  const storyGrid = stories.slice(1);

  return (
    <main>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#080808] pb-8 pt-24 sm:pb-10 lg:pb-14">
        <div className="story-grain absolute inset-0">
          <img
            src={featured.image}
            alt={featured.alt}
            className="h-full w-full object-cover object-[65%_center] brightness-[0.72] saturate-[0.76]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.52)_42%,rgba(8,8,8,0.07)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.72)_0%,transparent_50%)]" />
        </div>

        <div className="page-shell relative z-10 grid w-full gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,.75fr)] lg:items-end">
          <div className="max-w-4xl">
            <div className="reveal-up mb-6 flex items-center gap-3">
              <span className="h-px w-9 bg-[#b78a58]" />
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#e3c29f]">Cerita pilihan / {featured.accent}</p>
            </div>
            <h1 className="reveal-up-delay max-w-4xl font-display text-[clamp(3.3rem,8.5vw,8.4rem)] leading-[0.83] tracking-[-0.065em] text-[#f8f5ef]">
              Perubahan yang tenang dimulai sebelum matahari tiba.
            </h1>
          </div>

          <div className="reveal-up-delay-2 max-w-md justify-self-end border-l border-[#b78a58]/75 pl-5 lg:mb-2">
            <p className="font-sans text-sm leading-relaxed text-[#ebe8e1]/88 sm:text-base">{featured.deck}</p>
            <Link href={`/stories/${featured.slug}`} className="link-sightline mt-6">
              Baca catatan lapangan <ArrowUpRight size={15} className="text-[#b78a58]" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 right-5 z-10 hidden items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#e6e2db]/70 sm:right-8 md:flex lg:right-12">
          <span>Gulir untuk masuk</span><ArrowDown size={13} className="text-[#b78a58]" />
        </div>
      </section>

      <EditorialMarquee />

      <section id="stories" className="bg-[#f3f0ea] py-16 text-[#121110] sm:py-24 lg:py-32">
        <div className="page-shell">
          <div className="mb-12 grid gap-6 border-b border-black/15 pb-7 sm:mb-16 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-9">
            <div>
              <p className="eyebrow mb-4">Indeks cerita</p>
              <h2 className="max-w-3xl font-display text-[clamp(3rem,5vw,5.25rem)] leading-[0.85] tracking-[-0.06em]">Arsip yang hidup tentang hal-hal yang menggerakkan kerja ke depan.</h2>
            </div>
            <Link href="/stories" className="group inline-flex items-center gap-3 font-mono text-[0.63rem] uppercase tracking-[0.16em] text-[#24211e] transition-colors hover:text-[#b78a58]">
              Jelajahi semua cerita <MoveRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-12 md:gap-y-20 lg:gap-x-8">
            <StoryCard story={storyGrid[0]} className="md:col-span-7" priority />
            <div className="md:col-span-5 md:pt-24">
              <StoryCard story={storyGrid[1]} compact />
              <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-[#625e58]">Rekaman yang cermat tentang percakapan, objek, dan keputusan yang membentuk kerja di balik permukaan.</p>
            </div>
            <div className="border-t border-black/15 pt-6 md:col-span-4 md:mt-28">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[#b78a58]">Catatan editor / Vol. 04</p>
              <p className="mt-5 font-display text-3xl leading-[0.95] tracking-[-0.045em] text-[#1b1917] sm:text-4xl">Ikuti detail yang jarang menjadi tajuk utama.</p>
              <Link href={`/stories/${storyGrid[2].slug}`} className="link-sightline mt-7 !border-[#24211e]/55 !text-[#24211e] hover:!border-[#b78a58] hover:!text-[#b78a58]">
                Buka cerita 03 <ArrowUpRight size={15} />
              </Link>
            </div>
            <StoryCard story={storyGrid[2]} className="md:col-span-4" />
            <StoryCard story={storyGrid[3]} className="md:col-span-4 md:mt-16" />
            <StoryCard story={storyGrid[4]} className="md:col-span-8 md:mt-[-8rem]" compact />
          </div>
        </div>
      </section>

      <section id="impact" className="relative overflow-hidden bg-[#11100f] py-20 sm:py-28 lg:py-36">
        <div className="absolute left-[12%] top-0 h-px w-[72%] bg-[#b78a58]/40" />
        <div className="page-shell grid gap-12 lg:grid-cols-[0.48fr_1fr] lg:gap-24">
          <div className="flex flex-col justify-between gap-8">
            <p className="eyebrow">Dampak yang dipertimbangkan</p>
            <p className="max-w-[14rem] font-mono text-[0.63rem] leading-relaxed tracking-[0.1em] text-[#aaa59d]">Sebuah arsip dapat menyimpan bukti tanpa mereduksi kehidupan di dalamnya.</p>
          </div>
          <div>
            <p className="max-w-5xl font-display text-[clamp(3rem,7.1vw,7rem)] leading-[0.87] tracking-[-0.06em] text-[#f3f0ea]">
              <span className="text-[#b78a58]">18 bulan</span> mendengarkan, memetakan, dan kembali ke cakrawala yang sama.
            </p>
            <div className="mt-12 grid gap-5 border-t border-white/15 pt-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <p className="max-w-xl text-base leading-relaxed text-[#c1bdb5]">Perubahan yang paling bertahan lama jarang dimulai dari klaim. Ia bermula dari ruang agar orang dapat menuturkan cerita yang lebih utuh bersama-sama.</p>
              <Link href={`/stories/${featured.slug}`} className="link-sightline">Baca catatan dampak <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="culture" className="bg-[#080808] py-16 sm:py-24 lg:py-32">
        <div className="page-shell">
          <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow mb-4">Di balik layar</p>
              <h2 className="max-w-3xl font-display text-[clamp(3rem,5vw,5.25rem)] leading-[0.85] tracking-[-0.06em] text-[#f3f0ea]">Catatan di balik bingkai yang selesai.</h2>
            </div>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-[#a9a59e]">Contact sheet, material proses, dan percakapan larut yang jarang masuk ke penyuntingan akhir.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.65fr_0.8fr] lg:gap-10">
            <div className="story-grain relative aspect-[16/10] overflow-hidden bg-[#131313]">
              <img src={editorialMedia.bts} alt="Contact sheet dan kamera analog di samping lampu meja yang hangat." className="h-full w-full object-cover brightness-[0.8] saturate-[0.75]" loading="lazy" />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 z-[3] max-w-xs font-mono text-[0.6rem] leading-relaxed tracking-[0.11em] text-[#f3f0ea]/80">03:17 / Meninjau gambar yang mengajarkan apa yang sempat kami lewatkan.</p>
            </div>
            <div className="flex flex-col justify-between border-l border-white/10 pl-5 sm:pl-7">
              <p className="font-display text-3xl leading-[0.96] tracking-[-0.045em] text-[#f3f0ea] sm:text-4xl">“Arsip adalah bagian dari praktik, bukan catatan yang dibuat setelahnya.”</p>
              <div className="mt-10 border-t border-white/10 pt-5">
                <p className="font-mono text-[0.59rem] uppercase tracking-[0.16em] text-[#b78a58]">Jurnal studio / 03.26</p>
                <Link href={`/stories/${stories[1].slug}`} className="link-sightline mt-5">Masuk ke studio <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
