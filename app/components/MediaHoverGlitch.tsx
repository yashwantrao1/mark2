"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** Empty hover accent cells (no images — GSAP staggers visibility). */

type Props = {
  children: ReactNode;
  className?: string;
  /** Poster / fill media: layer is `absolute inset-0` like home banners. */
  mediaFill?: boolean;
  numberOfGRid: number
};

export function MediaHoverGlitch({ children, className = "", mediaFill = false, numberOfGRid }: Props) {
  
  const HOVER_SLOT_COUNT =  numberOfGRid || 6;
  const [cardHover, setCardHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!cardHover) return;
    const root = rootRef.current;
    if (!root) return;
    const cells = [...root.querySelectorAll<HTMLElement>("[data-hover-slot]")];
    if (!cells.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cells,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.09,
          ease: "power2.out",
          stagger: { each: 0.034, from: "random" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [cardHover]);

  const hoverSlots = Array.from({ length: HOVER_SLOT_COUNT }, (_, i) => i);

  return (
    <div
      ref={rootRef}
      className={`relative isolate ${className}`}
      onPointerEnter={() => setCardHover(true)}
      onPointerLeave={() => setCardHover(false)}
    >
      <div className={`${mediaFill ? "absolute inset-0" : "relative"} isolate z-0 min-h-0`}>{children}</div>
      {hoverSlots.map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <div
            key={i}
            data-hover-slot
            style={{
              left: `${(col / 3) * 100}%`,
              top: `${(row / 2) * 100}%`,
              width: `${100 / 3}%`,
              height: `${50}%`,
              mixBlendMode: "exclusion",
            }}
            className={`pointer-events-none absolute z-2 box-border min-h-0 min-w-0 bg-[#fefdfc]/65 ${
              cardHover ? "visible" : "invisible"
            }`}
          />
        );
      })}
    </div>
  );
}
