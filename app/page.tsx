"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import SplitType from "split-type";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  BANNER_GRID_SLOTS,
  TEXT_FIELD_BEFORE_COUNT,
  TEXT_FIELD_SLOT,
  gridSlotStyle,
  type GridSlot,
} from "./bannerGridSlots";

const HERO_DEFAULT = "Dive into digital immersion.";

/** Explicit track counts for `<main>` (layout uses col/row line positions up to these). */
const MAIN_GRID_COLS = 86;
const MAIN_GRID_ROWS = 60;

type HomeCell = {
  id: number;
  name: string;
  image: string;
  link: string;
  images?: string[];
};

/** Places each banner on a distinct random tile; JSON row order ≠ reading order on the grid. */
function assignBannersToRandomSlots(cells: HomeCell[]): (HomeCell | undefined)[] {
  const slotCount = BANNER_GRID_SLOTS.length;
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

/** Non-hovered banners fade out together (random stagger) while one card is active. */
const PEER_HIDE_DURATION = 0.26;
const PEER_SHOW_DURATION = 0.34;
const PEER_STAGGER_EACH = 0.005;
const HOVER_LEAVE_GAP_MS = 50;

/** Empty hover accent cells (no images — GSAP staggers visibility). */
const HOVER_SLOT_COUNT = 6;

function BannerTile({
  gridSlot,
  item,
  onHoverLabel,
  tileIndex,
  isFocusTile,
  onBannerPeerEnter,
  onBannerPeerLeave,
}: {
  gridSlot: GridSlot;
  item: HomeCell | undefined;
  onHoverLabel: (label: string | null) => void;
  tileIndex: number;
  isFocusTile: boolean;
  onBannerPeerEnter: (index: number) => void;
  onBannerPeerLeave: () => void;
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
    onBannerPeerEnter(tileIndex);
  };

  const handleLeave = () => {
    onHoverLabel(null);
    setCardHover(false);
    onBannerPeerLeave();
  };

  const hoverSlots = Array.from({ length: HOVER_SLOT_COUNT }, (_, i) => i);

  return (
    <div
      data-banner-tile=""
      data-tile-index={String(tileIndex)}
      className={`relative min-h-0 ${isFocusTile ? "z-30" : "z-0"}`}
      style={gridSlotStyle(gridSlot)}
      {...(item ? undefined : emptyHover)}
    >
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
  const [hoveredPeerIndex, setHoveredPeerIndex] = useState<number | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const hoverLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const peerHideWasActiveRef = useRef(false);

  const onHoverLabel = (label: string | null) => {
    setHeroLabel(label?.trim() ? label : HERO_DEFAULT);
  };

  const clearPeerLeaveTimer = () => {
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
  };

  const onBannerPeerEnter = (index: number) => {
    clearPeerLeaveTimer();
    setHoveredPeerIndex(index);
  };

  const onBannerPeerLeave = () => {
    clearPeerLeaveTimer();
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHoveredPeerIndex(null);
      hoverLeaveTimerRef.current = null;
    }, HOVER_LEAVE_GAP_MS);
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
            stagger: { each: GRID_REVEAL_STAGGER, from: "random" },
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

  useLayoutEffect(() => {
    if (!bannerBySlot) return;
    const main = mainRef.current;
    if (!main) return;

    const nodes = [...main.querySelectorAll<HTMLElement>("[data-banner-tile]")];
    if (!nodes.length) return;

    // Never kill tweens here on idle paint: that aborts the grid-reveal tween and
    // leaves tiles stuck at autoAlpha: 0 from its from-state.
    if (hoveredPeerIndex === null) {
      if (!peerHideWasActiveRef.current) return;
      peerHideWasActiveRef.current = false;
      gsap.killTweensOf(nodes);
      gsap.to(nodes, {
        autoAlpha: 1,
        duration: PEER_SHOW_DURATION,
        ease: "power2.out",
        stagger: { each: PEER_STAGGER_EACH, from: "random" },
      });
      return;
    }

    gsap.killTweensOf(nodes);
    peerHideWasActiveRef.current = true;
    const stay: HTMLElement[] = [];
    const hide: HTMLElement[] = [];
    const key = String(hoveredPeerIndex);
    for (const el of nodes) {
      if (el.getAttribute("data-tile-index") === key) stay.push(el);
      else hide.push(el);
    }
    if (stay.length) gsap.set(stay, { autoAlpha: 1 });
    if (hide.length) {
      gsap.to(hide, {
        autoAlpha: 0,
        duration: PEER_HIDE_DURATION,
        ease: "power2.inOut",
        stagger: { each: PEER_STAGGER_EACH, from: "random" },
      });
    }
  }, [hoveredPeerIndex, bannerBySlot]);

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
        className="grid gap-2 h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${MAIN_GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAIN_GRID_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {BANNER_GRID_SLOTS.slice(0, TEXT_FIELD_BEFORE_COUNT).map((slot, index) => (
          <BannerTile
            key={`banner-${index}`}
            gridSlot={slot}
            item={bannerBySlot?.[index]}
            onHoverLabel={onHoverLabel}
            tileIndex={index}
            isFocusTile={hoveredPeerIndex === index}
            onBannerPeerEnter={onBannerPeerEnter}
            onBannerPeerLeave={onBannerPeerLeave}
          />
        ))}
        <div
          className="text-field whitespace-pre flex items-center justify-center"
          style={gridSlotStyle(TEXT_FIELD_SLOT)}
          title={HERO_DEFAULT}
          onPointerEnter={() => onHoverLabel(HERO_DEFAULT)}
          onPointerLeave={() => onHoverLabel(null)}
        >
          <HeroAnimatedHeading key={heroLabel} text={heroLabel}  />
        </div>
        {BANNER_GRID_SLOTS.slice(TEXT_FIELD_BEFORE_COUNT).map((slot, index) => {
          const globalIndex = TEXT_FIELD_BEFORE_COUNT + index;
          return (
            <BannerTile
              key={`banner-${globalIndex}`}
              gridSlot={slot}
              item={bannerBySlot?.[globalIndex]}
              onHoverLabel={onHoverLabel}
              tileIndex={globalIndex}
              isFocusTile={hoveredPeerIndex === globalIndex}
              onBannerPeerEnter={onBannerPeerEnter}
              onBannerPeerLeave={onBannerPeerLeave}
            />
          );
        })}
      </main>
    </div>
  );
}
