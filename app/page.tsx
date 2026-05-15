"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import SplitType from "split-type";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { type HomeCell, getWorkSlug } from "@/lib/homeData";
import { isVideoMediaPath } from "@/lib/mediaPaths";

import {
  BANNER_GRID_SLOTS,
  TEXT_FIELD_BEFORE_COUNT,
  TEXT_FIELD_SLOT,
  gridSlotStyle,
  isExcludedBannerPlacement,
  type GridSlot,
} from "./bannerGridSlots";

const HERO_DEFAULT = "Dive into digital immersion.";

/** Explicit track counts for `<main>` (layout uses col/row line positions up to these). */
const MAIN_GRID_COLS = 86;
const MAIN_GRID_ROWS = 60;

/** Hover collage on `/` uses only this many entries from `images[]`; the full list is on `/work/[slug]`. */
const HOME_HOVER_COLLAGE_MAX_IMAGES = 5;

/** Places each banner on a distinct random eligible tile; JSON row order ≠ reading order on the grid. */
function assignBannersToRandomSlots(cells: HomeCell[]): (HomeCell | undefined)[] {
  const slotCount = BANNER_GRID_SLOTS.length;
  const eligibleIndices = BANNER_GRID_SLOTS.reduce<number[]>((acc, slot, i) => {
    if (!isExcludedBannerPlacement(slot)) acc.push(i);
    return acc;
  }, []);

  const order = [...eligibleIndices];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const bySlot: (HomeCell | undefined)[] = Array(slotCount).fill(undefined);
  const place = Math.min(cells.length, order.length);
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
      className="text-5xl font-bold text-center  whitespace-pre "
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

/** Hover collage stays inside `main` grid and clears hero + hovered tile (same placement lines as banners). */
const COLLAGE_COL_SPAN_MIN = 18;
const COLLAGE_COL_SPAN_MAX = 30;
const COLLAGE_ROW_SPAN_MIN = 8;
const COLLAGE_ROW_SPAN_MAX = 30;

/** CSS grid line semantics: `grid-column: cs / span csp` ⇒ half-open columns [cs, cs + csp). */
function gridRangesOverlap(cs: number, csp: number, ds: number, dsp: number) {
  return cs < ds + dsp && ds < cs + csp;
}

function collageIntersectsHero(
  colStart: number,
  colSpan: number,
  rowStart: number,
  rowSpan: number
) {
  const h = TEXT_FIELD_SLOT;
  return (
    gridRangesOverlap(colStart, colSpan, h.colStart, h.colSpan) &&
    gridRangesOverlap(rowStart, rowSpan, h.rowStart, h.rowSpan)
  );
}

function collageIntersectsSlot(
  colStart: number,
  colSpan: number,
  rowStart: number,
  rowSpan: number,
  slot: GridSlot | null | undefined
) {
  if (!slot) return false;
  return (
    gridRangesOverlap(colStart, colSpan, slot.colStart, slot.colSpan) &&
    gridRangesOverlap(rowStart, rowSpan, slot.rowStart, slot.rowSpan)
  );
}

function collagePlacementInsideMain(
  colStart: number,
  colSpan: number,
  rowStart: number,
  rowSpan: number
) {
  return (
    colStart >= 1 &&
    rowStart >= 1 &&
    colStart + colSpan <= MAIN_GRID_COLS + 1 &&
    rowStart + rowSpan <= MAIN_GRID_ROWS + 1
  );
}

type CollageLayout = {
  colStart: number;
  colSpan: number;
  gridRowStart: number;
  gridRowSpan: number;
};

function makeSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Skews toward wider tiles (max of two uniforms) so collage images aren’t tiny. */
function pickColSpanBiased(rnd: () => number) {
  const wide = Math.max(rnd(), rnd());
  const span =
    COLLAGE_COL_SPAN_MIN +
    Math.floor(wide * (COLLAGE_COL_SPAN_MAX - COLLAGE_COL_SPAN_MIN + 1));
  return Math.min(COLLAGE_COL_SPAN_MAX, span);
}

/** Skews toward taller row bands without always using max rows. */
function pickRowSpanBiased(rnd: () => number) {
  const wide = Math.max(rnd(), rnd());
  const span =
    COLLAGE_ROW_SPAN_MIN +
    Math.floor(wide * (COLLAGE_ROW_SPAN_MAX - COLLAGE_ROW_SPAN_MIN + 1));
  return Math.min(COLLAGE_ROW_SPAN_MAX, span);
}

function collagePlacementValid(
  colStart: number,
  colSpan: number,
  rowStart: number,
  rowSpan: number,
  hoveredSlot: GridSlot | null | undefined,
  placed: CollageLayout[]
): boolean {
  if (!collagePlacementInsideMain(colStart, colSpan, rowStart, rowSpan)) return false;
  if (collageIntersectsHero(colStart, colSpan, rowStart, rowSpan)) return false;
  if (collageIntersectsSlot(colStart, colSpan, rowStart, rowSpan, hoveredSlot)) return false;
  for (const L of placed) {
    if (
      gridRangesOverlap(colStart, colSpan, L.colStart, L.colSpan) &&
      gridRangesOverlap(rowStart, rowSpan, L.gridRowStart, L.gridRowSpan)
    )
      return false;
  }
  return true;
}

function sweepCollageFallback(
  hoveredSlot: GridSlot | null | undefined,
  placed: CollageLayout[]
): CollageLayout | null {
  for (let rowSpan = COLLAGE_ROW_SPAN_MIN; rowSpan <= COLLAGE_ROW_SPAN_MAX; rowSpan++) {
    for (let colSpan = COLLAGE_COL_SPAN_MAX; colSpan >= 10; colSpan--) {
      for (let rowStart = 1; rowStart <= MAIN_GRID_ROWS - rowSpan + 1; rowStart++) {
        for (let colStart = 1; colStart <= MAIN_GRID_COLS - colSpan + 1; colStart++) {
          if (
            collagePlacementValid(colStart, colSpan, rowStart, rowSpan, hoveredSlot, placed)
          ) {
            return {
              colStart,
              colSpan,
              gridRowStart: rowStart,
              gridRowSpan: rowSpan,
            };
          }
        }
      }
    }
  }
  return null;
}

/** Random rects (biased wide/tall spans) avoiding hero, hovered tile, overlaps, and `main` bounds. */
function buildCollageLayouts(
  seed: number,
  count: number,
  hoveredSlot: GridSlot | null | undefined
): CollageLayout[] {
  const rnd = makeSeededRandom(seed);
  const layouts: CollageLayout[] = [];

  for (let i = 0; i < count; i++) {
    let next: CollageLayout | null = null;

    for (let attempt = 0; attempt < 140; attempt++) {
      const colSpan = pickColSpanBiased(rnd);
      const rowSpan = pickRowSpanBiased(rnd);
      const colStart =
        1 + Math.floor(rnd() * Math.max(1, MAIN_GRID_COLS - colSpan + 1));
      const rowStart =
        1 + Math.floor(rnd() * Math.max(1, MAIN_GRID_ROWS - rowSpan + 1));

      if (collagePlacementValid(colStart, colSpan, rowStart, rowSpan, hoveredSlot, layouts)) {
        next = {
          colStart,
          colSpan,
          gridRowStart: rowStart,
          gridRowSpan: rowSpan,
        };
        break;
      }
    }

    if (!next) {
      for (
        let colSpan = COLLAGE_COL_SPAN_MAX;
        colSpan >= COLLAGE_COL_SPAN_MIN && !next;
        colSpan--
      ) {
        for (let inner = 0; inner < 72 && !next; inner++) {
          const rowSpan = pickRowSpanBiased(rnd);
          const colStart =
            1 + Math.floor(rnd() * Math.max(1, MAIN_GRID_COLS - colSpan + 1));
          const rowStart =
            1 + Math.floor(rnd() * Math.max(1, MAIN_GRID_ROWS - rowSpan + 1));

          if (
            collagePlacementValid(colStart, colSpan, rowStart, rowSpan, hoveredSlot, layouts)
          ) {
            next = {
              colStart,
              colSpan,
              gridRowStart: rowStart,
              gridRowSpan: rowSpan,
            };
          }
        }
      }
    }

    if (!next) next = sweepCollageFallback(hoveredSlot, layouts);

    if (next) layouts.push(next);
  }

  return layouts;
}

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

function HoverCollageLayer({
  imageSrcs,
  layouts,
}: {
  imageSrcs: string[];
  layouts: CollageLayout[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const imgs = [...root.querySelectorAll<HTMLElement>("[data-collage-img]")];
    if (!imgs.length) return;

    gsap.killTweensOf(imgs);
    gsap.fromTo(
      imgs,
      { autoAlpha: 0, y: 14, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.29,
        ease: "power2.out",
        stagger: { each: 0.04, from: "random" },
      }
    );

    return () => {
      gsap.killTweensOf(imgs);
    };
  }, [imageSrcs, layouts]);

  return (
    <div
      ref={rootRef}
      data-hover-collage=""
      className="pointer-events-none absolute inset-0 z-[25] grid min-h-0 min-w-0 gap-2 overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${MAIN_GRID_COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${MAIN_GRID_ROWS}, minmax(0, 1fr))`,
      }}
      aria-hidden
    >
      {imageSrcs.map((src, i) => {
        const L = layouts[i];
        if (!L) return null;
        return (
          <div
            key={`${src}-${i}`}
            className="relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden"
            style={{
              gridColumn: `${L.colStart} / span ${L.colSpan}`,
              gridRow: `${L.gridRowStart} / span ${L.gridRowSpan}`,
            }}
          >
            {isVideoMediaPath(src) ? (
              <video
                data-collage-img
                src={publicSrc(src)}
                className="max-h-full max-w-full object-contain shadow-lg ring-1 ring-black/6"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                data-collage-img
                src={publicSrc(src)}
                alt=""
                className="max-h-full max-w-full object-contain shadow-lg ring-1 ring-black/6"
                draggable={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
          href={`/work/${getWorkSlug(item)}`}
          className="absolute inset-0 z-10 block min-h-0 overflow-hidden"          
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
  /** Bumps whenever a banner is hovered so collage positions reshuffle each enter. */
  const [collageNonce, setCollageNonce] = useState(0);
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
    setCollageNonce((n) => n + 1);
    setHoveredPeerIndex(index);
  };

  const hoveredCollage = useMemo(() => {
    if (hoveredPeerIndex === null || !bannerBySlot) return null;

    const cell = bannerBySlot[hoveredPeerIndex];
    if (!cell) return null;

    const fullSrcs =
      cell.images && cell.images.length > 0
        ? [...cell.images]
        : cell.image
          ? [cell.image]
          : [];
    const imageSrcs = fullSrcs.slice(0, HOME_HOVER_COLLAGE_MAX_IMAGES);
    if (!imageSrcs.length) return null;

    const slug = getWorkSlug(cell);
    let keyHash = 0;
    for (let i = 0; i < slug.length; i++) {
      keyHash = (keyHash << 5) - keyHash + slug.charCodeAt(i);
      keyHash |= 0;
    }
    const seed =
      collageNonce * 100003 +
      hoveredPeerIndex * 977 +
      (cell.id ?? 0) * 7919 +
      (keyHash >>> 0) +
      imageSrcs.length;

    const hoveredSlot = BANNER_GRID_SLOTS[hoveredPeerIndex] ?? null;

    const layouts = buildCollageLayouts(seed, imageSrcs.length, hoveredSlot);

    return { imageSrcs, layouts };
  }, [hoveredPeerIndex, bannerBySlot, collageNonce]);

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
        if ((el as HTMLElement).hasAttribute("data-hover-collage")) return;
        if ((el as HTMLElement).hasAttribute("data-grid-placeholder")) return;

        const delay = index * GRID_REVEAL_STAGGER;
        const ease = "power3.out";

        if (el.classList.contains("text-field")) {
          gsap.fromTo(
            el,
            {
              // clipPath: "inset(0 52% 0 52%)",
              filter: "saturate(1.85) hue-rotate(10deg)",
            },
            {
              // clipPath: "inset(0 0% 0 0%)",
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
            skewX: gsap.utils.random(-0, 0),
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
        className="relative grid gap-2 h-full w-full overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${MAIN_GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${MAIN_GRID_ROWS}, minmax(0, 1fr))`,
        }}
      >
        {BANNER_GRID_SLOTS.slice(0, TEXT_FIELD_BEFORE_COUNT).map((slot, index) =>
          isExcludedBannerPlacement(slot) ? (
            <div
              key={`banner-${index}`}
              data-grid-placeholder=""
              className="relative min-h-0"
              style={gridSlotStyle(slot)}
              aria-hidden
            />
          ) : (
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
          )
        )}
        <div
          className="text-field relative z-[40] whitespace-pre flex items-center justify-center"
          style={gridSlotStyle(TEXT_FIELD_SLOT)}
          title={HERO_DEFAULT}
          onPointerEnter={() => onHoverLabel(HERO_DEFAULT)}
          onPointerLeave={() => onHoverLabel(null)}
        >
          <HeroAnimatedHeading key={heroLabel} text={heroLabel}  />
        </div>
        {BANNER_GRID_SLOTS.slice(TEXT_FIELD_BEFORE_COUNT).map((slot, index) => {
          const globalIndex = TEXT_FIELD_BEFORE_COUNT + index;
          return isExcludedBannerPlacement(slot) ? (
            <div
              key={`banner-${globalIndex}`}
              data-grid-placeholder=""
              className="relative min-h-0"
              style={gridSlotStyle(slot)}
              aria-hidden
            />
          ) : (
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
        {hoveredCollage ? (
          <HoverCollageLayer imageSrcs={hoveredCollage.imageSrcs} layouts={hoveredCollage.layouts} />
        ) : null}
      </main>
    </div>
  );
}
