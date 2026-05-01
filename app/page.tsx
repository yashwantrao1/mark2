"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import SplitType from "split-type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  BANNER_GRID_SLOT_CLASSES,
  TEXT_FIELD_BEFORE_COUNT,
} from "./bannerGridSlots";

const HERO_DEFAULT = "Dive into digital immersion.";

type HomeCell = {
  id: number;
  name: string;
  image: string;
  link: string;
  images?: string[];
};

/** Places each banner on a distinct random tile; JSON row order ≠ reading order on the grid. */
function assignBannersToRandomSlots(cells: HomeCell[]): (HomeCell | undefined)[] {
  const slotCount = BANNER_GRID_SLOT_CLASSES.length;
  const order = Array.from({ length: slotCount }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const bySlot: (HomeCell | undefined)[] = Array(slotCount).fill(undefined);
  const place = Math.min(cells.length, slotCount);
  for (let k = 0; k < place; k++) bySlot[order[k]] = cells[k];
  return bySlot;
}

function HeroAnimatedHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !text.trim()) return;

    const split = new SplitType(el, {
      types: "lines,words,chars",
      tagName: "span",
    });
    const chars = split.chars;
    if (!chars?.length) return;

    gsap.set(chars, {
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "baseline",
      boxSizing: "content-box",
    });

    // Typewriter rhythm: linear “ink”, next char starts slightly before the last finishes (~machine typing).
    const keystrokeGap = 0.068;
    const inkDuration = 0.00048;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { width: 0 },
        {
          width: "auto",
          duration: inkDuration,
          ease: "none",
          stagger: { each: keystrokeGap, from: "start" },
        }
      );
    }, el);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text]);

  return (
    <h1
      ref={ref}
      data-animate=""
      className="text-5xl font-bold text-center  whitespace-pre"
    >
      {text}
    </h1>
  );
}

const GRID_REVEAL_STAGGER = 0.0096;
const GRID_REVEAL_DURATION = 0.0532;

/** Empty hover accent cells (no images — GSAP staggers visibility). */
const HOVER_SLOT_COUNT = 6;

function BannerTile({
  className,
  item,
  onHoverLabel,
}: {
  className: string;
  item: HomeCell | undefined;
  onHoverLabel: (label: string | null) => void;
}) {
  const label = item?.name?.trim() ? item.name : null;
  const [cardHover, setCardHover] = useState(false);
  const tileLinkRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (!cardHover) return;
    const root = tileLinkRef.current;
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

  const emptyHover = {
    onPointerEnter: () => onHoverLabel(label),
    onPointerLeave: () => onHoverLabel(null),
  };

  const handleEnter = () => {
    onHoverLabel(label);
    setCardHover(true);
  };

  const handleLeave = () => {
    onHoverLabel(null);
    setCardHover(false);
  };

  const hoverSlots = Array.from({ length: HOVER_SLOT_COUNT }, (_, i) => i);

  return (
    <div className={`${className} relative min-h-0`} {...(item ? undefined : emptyHover)}>
      {item ? (
        <Link
          ref={tileLinkRef}
          href={item.link}
          className="absolute inset-0 z-10 block min-h-0 overflow-hidden"
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          onPointerEnter={handleEnter}
          onPointerLeave={handleLeave}
        >
          {/* isolate: overlays blend against the bitmap of this subtree (cover + tint cells), not leaked filter contexts */}
          <div className="pointer-events-none absolute inset-0 isolate z-0 min-h-0">
            <Image
              src={`/${item.image}`}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 1536px) 15vw, 200px"
            />
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

        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [bannerBySlot, setBannerBySlot] = useState<(HomeCell | undefined)[] | null>(null);
  const [heroLabel, setHeroLabel] = useState(HERO_DEFAULT);
  const mainRef = useRef<HTMLElement>(null);

  const onHoverLabel = (label: string | null) => {
    setHeroLabel(label?.trim() ? label : HERO_DEFAULT);
  };

  useLayoutEffect(() => {
    if (!bannerBySlot) return;

    const main = mainRef.current;
    if (!main) return;

    const tiles = [...main.children] as HTMLElement[];

    const ctx = gsap.context(() => {
      tiles.forEach((el, index) => {
        const delay = index * GRID_REVEAL_STAGGER;
        const ease = "power3.out";

        if (el.classList.contains("text-field")) {
          gsap.fromTo(
            el,
            {
              clipPath: "inset(0 52% 0 52%)",
              filter: "saturate(1.85) hue-rotate(10deg)",
            },
            {
              clipPath: "inset(0 0% 0 0%)",
              filter: "brightness(1) saturate(1) hue-rotate(0deg)",
              duration: 0.52,
              ease,
              delay,
            }
          );
          return;
        }

        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            x: gsap.utils.random(-5, 5),
            skewX: gsap.utils.random(-10, 10),
            filter: "brightness(1.95) blur(5px)",
          },
          {
            autoAlpha: 1,
            x: 0,
            skewX: 0,
            filter: "none",
            duration: GRID_REVEAL_DURATION,
            ease,
            delay,
            onComplete: () => {
              gsap.set(el, { clearProps: "filter" });
            },
          }
        );
      });
    }, main);

    return () => ctx.revert();
  }, [bannerBySlot]);

  useEffect(() => {
    let cancelled = false;
    fetch("/home.json")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<HomeCell[]>;
      })
      .then((data) => {
        if (!cancelled) setBannerBySlot(assignBannersToRandomSlots(data));
      })
      .catch(() => {
        if (!cancelled) setBannerBySlot(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-zinc-50 h-screen w-screen">
      <main
        ref={mainRef}
        className="grid grid-cols-92 grid-rows-58 gap-2 h-full w-full"
      >
        {BANNER_GRID_SLOT_CLASSES.slice(0, TEXT_FIELD_BEFORE_COUNT).map((className, index) => (
          <BannerTile
            key={`banner-${index}`}
            className={className}
            item={bannerBySlot?.[index]}
            onHoverLabel={onHoverLabel}
          />
        ))}
        <div
          className="col-span-36 row-span-6 row-start-27 col-start-29 text-field whitespace-pre"
          title={HERO_DEFAULT}
          onPointerEnter={() => onHoverLabel(HERO_DEFAULT)}
          onPointerLeave={() => onHoverLabel(null)}
        >
          <HeroAnimatedHeading key={heroLabel} text={heroLabel}  />
        </div>
        {BANNER_GRID_SLOT_CLASSES.slice(TEXT_FIELD_BEFORE_COUNT).map((className, index) => {
          const globalIndex = TEXT_FIELD_BEFORE_COUNT + index;
          return (
            <BannerTile
              key={`banner-${globalIndex}`}
              className={className}
              item={bannerBySlot?.[globalIndex]}
              onHoverLabel={onHoverLabel}
            />
          );
        })}
      </main>
    </div>
  );
}
