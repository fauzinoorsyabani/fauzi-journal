/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * The empty route is framed as an absent story, retaining an elegant way back to the archive.
 */
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="grid min-h-[78vh] place-items-center bg-[#080808] px-5 pt-24 text-[#f3f0ea]">
      <div className="max-w-2xl text-center">
        <p className="eyebrow">404 / Missing frame</p>
        <h1 className="mt-6 font-display text-[clamp(4rem,10vw,9rem)] leading-[0.8] tracking-[-0.07em]">Out of frame.</h1>
        <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-[#aaa69f] sm:text-base">The page you were looking for has moved beyond the current edit. The story index is still open.</p>
        <Link href="/" className="link-sightline mt-9"><ArrowLeft size={15} /> Return home</Link>
      </div>
    </main>
  );
}
