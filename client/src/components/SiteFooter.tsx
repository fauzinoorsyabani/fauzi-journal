/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * Footer closes the experience like a final gallery plate: structured, dark, and deliberate.
 */
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] text-[#f3f0ea]">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-24 lg:py-24">
          <div>
            <BrandMark className="mb-9" />
            <p className="max-w-sm font-sans text-base leading-relaxed text-[#b8b4ad] sm:text-lg">
              A visual journal for stories of impact, culture, and the work that makes both matter.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="mb-4 font-mono text-[0.61rem] uppercase tracking-[0.18em] text-[#b78a58]">For the press</p>
              <a
                href="mailto:media@lensstories.studio"
                className="group inline-flex items-center gap-2 border-b border-white/30 pb-1 font-display text-2xl leading-tight text-[#f3f0ea] transition-colors hover:border-[#b78a58] sm:text-3xl"
              >
                Media inquiries
                <ArrowUpRight size={18} className="text-[#b78a58] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <p className="mt-4 font-mono text-[0.64rem] tracking-[0.08em] text-[#8d8983]">media@lensstories.studio</p>
            </div>
            <div>
              <p className="mb-4 font-mono text-[0.61rem] uppercase tracking-[0.18em] text-[#b78a58]">Elsewhere</p>
              <div className="flex flex-col items-start gap-3 font-mono text-[0.65rem] uppercase tracking-[0.13em] text-[#d6d2cb]">
                <a href="#stories" className="transition-colors hover:text-[#b78a58]">Story index</a>
                <a href="#impact" className="transition-colors hover:text-[#b78a58]">Impact notes</a>
                <a href="#culture" className="transition-colors hover:text-[#b78a58]">Behind the scenes</a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[#77736d] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LensStories. Made for the work beneath the surface.</p>
          <p>Volume 04 · The everyday archive</p>
        </div>
      </div>
    </footer>
  );
}
