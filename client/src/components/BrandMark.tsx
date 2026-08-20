/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * The aperture mark is a sculptural, high-contrast symbol for Fauzi / Journal—not a generic app icon.
 */
type BrandMarkProps = {
  className?: string;
  withWordmark?: boolean;
  light?: boolean;
};

import { editorialMedia } from "@/lib/media";

export function BrandMark({
  className = "",
  withWordmark = true,
  light = true,
}: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={editorialMedia.mark}
        alt="Fauzi Journal aperture mark"
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
      />
      {withWordmark ? (
        <span
          className={`flex items-baseline gap-1 whitespace-nowrap ${
            light ? "text-[#f3f0ea]" : "text-[#111111]"
          }`}
        >
          <span className="font-display text-[1.55rem] leading-none tracking-[-0.075em] sm:text-[1.7rem]">
            Fauzi
          </span>
          <span className="font-sans text-[0.61rem] font-bold uppercase tracking-[0.16em]">
            Journal
          </span>
        </span>
      ) : null}
    </div>
  );
}
