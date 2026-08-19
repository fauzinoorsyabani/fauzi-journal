/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * Header behaves like a gallery rail: quiet over imagery, then opaque for reading contrast.
 */
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { BrandMark } from "./BrandMark";

const navItems = [
  { label: "Stories", href: "/stories" },
  { label: "Impact", href: "/#impact" },
  { label: "Culture", href: "/#culture" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isStoryPage = location.startsWith("/stories/");
  const isStoryIndex = location === "/stories";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const solid = isScrolled || isStoryPage || isStoryIndex || isOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-white/10 bg-[#080808]/92 text-[#f3f0ea] backdrop-blur-xl"
          : "border-transparent bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-[4.75rem] max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="LensStories home" className="relative z-10">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#d5d1ca]/80 transition-colors hover:text-[#f3f0ea]"
            >
              <span className="h-1 w-1 rounded-full bg-[#b78a58] opacity-0 transition-opacity group-hover:opacity-100" />
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="mailto:media@lensstories.studio"
          className="hidden border-b border-[#b78a58]/70 pb-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#f3f0ea] transition-colors hover:border-[#f3f0ea] lg:block"
        >
          Media inquiries
        </a>

        <button
          type="button"
          className="relative z-10 grid h-10 w-10 place-items-center border border-white/20 bg-black/20 text-[#f3f0ea] transition-transform duration-150 active:scale-[0.97] lg:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/10 bg-[#080808] transition-[max-height,opacity] duration-300 lg:hidden ${
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-5 py-5 sm:px-8" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl text-[#f3f0ea]"
              >
                {item.label}
                <span className="font-mono text-[0.6rem] text-[#b78a58]">0{index + 1}</span>
              </a>
            ))}
            <a
              href="mailto:media@lensstories.studio"
              className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#b78a58]"
            >
              media@lensstories.studio
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
