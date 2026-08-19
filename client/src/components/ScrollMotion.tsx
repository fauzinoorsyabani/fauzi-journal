/**
 * Style guide: Fauzi / Journal.
 * Motion is restrained and physical: frames drift subtly while editorial copy enters only when it becomes relevant.
 */
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

type RevealProps = { children: ReactNode; className?: string; delay?: "none" | "short" | "long" };

export function Reveal({ children, className = "", delay = "none" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      element.dataset.revealed = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.revealed = "true";
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} data-delay={delay} className={`reveal-on-scroll ${className}`}>{children}</div>;
}

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function ParallaxImage({ src, alt, className = "", imageClassName = "", imageStyle, loading = "lazy", fetchPriority }: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frameId = 0;
    const update = () => {
      frameId = 0;
      const rect = frame.getBoundingClientRect();
      const viewportMiddle = window.innerHeight / 2;
      const frameMiddle = rect.top + rect.height / 2;
      const progress = Math.max(-1, Math.min(1, (viewportMiddle - frameMiddle) / (window.innerHeight + rect.height)));
      image.style.transform = `translate3d(0, ${progress * 36}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      if (!frameId) frameId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={frameRef} className={`parallax-frame relative overflow-hidden ${className}`}>
      <img ref={imageRef} src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} style={imageStyle} className={`absolute -top-[8%] left-0 h-[116%] w-full max-w-none object-cover ${imageClassName}`} />
    </div>
  );
}
