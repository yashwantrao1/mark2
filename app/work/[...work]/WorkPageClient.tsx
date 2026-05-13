"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  clearWorkRouteTransition,
  normalizePublicSrc,
  readWorkRouteTransition,
} from "@/lib/workRouteTransition";
import { WORK_ROUTE_FRAME_INNER, WORK_ROUTE_FRAME_OUTER } from "@/lib/workRouteFrame";
import { isVideoMediaPath } from "@/lib/mediaPaths";

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

const SHRINK_MS = 0.62;
const SHRINK_EASE = "power3.inOut";

type Props = {
  workSlug: string;
  heading: string;
  body: string;
  imagePaths: string[];
  name: string;
  posterSrc: string;
};

function resolveTargetTileIndex(imagePaths: string[], posterSrc: string): number {
  const posterNorm = normalizePublicSrc(posterSrc);
  if (!isVideoMediaPath(posterSrc)) {
    const match = imagePaths.findIndex((p) => normalizePublicSrc(publicSrc(p)) === posterNorm);
    if (match >= 0) return match;
  }
  const firstStill = imagePaths.findIndex((s) => !isVideoMediaPath(s));
  return firstStill >= 0 ? firstStill : 0;
}

export default function WorkPageClient({ workSlug, heading, body, imagePaths, name, posterSrc }: Props) {
  const targetIdx = resolveTargetTileIndex(imagePaths, posterSrc);
  const targetTileRef = useRef<HTMLLIElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [inbound, setInbound] = useState<null | { imageSrc: string }>(null);
  const [revealContent, setRevealContent] = useState(false);
  const shrinkStageRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef(false);

  useLayoutEffect(() => {
    if (gateRef.current) return;
    if (imagePaths.length === 0) {
      const stale = readWorkRouteTransition();
      if (stale) clearWorkRouteTransition();
      setRevealContent(true);
      gateRef.current = true;
      return;
    }
    const data = readWorkRouteTransition();
    if (!data || data.slug.trim() !== workSlug.trim()) {
      if (data) clearWorkRouteTransition();
      setRevealContent(true);
      gateRef.current = true;
      return;
    }
    const stored = normalizePublicSrc(data.imageSrc);
    const poster = normalizePublicSrc(posterSrc);
    if (stored !== poster) {
      clearWorkRouteTransition();
      setRevealContent(true);
      gateRef.current = true;
      return;
    }
    gateRef.current = true;
    clearWorkRouteTransition();
    setInbound({ imageSrc: stored });
  }, [imagePaths.length, posterSrc, workSlug]);

  useLayoutEffect(() => {
    if (!inbound) return;
    let tween: gsap.core.Tween | null = null;
    let cancelled = false;
    let raf = 0;
    let raf2 = 0;

    let frames = 0;
    const maxFrames = 240;

    const run = () => {
      if (cancelled) return;
      frames += 1;
      if (frames > maxFrames) {
        setInbound(null);
        setRevealContent(true);
        return;
      }
      const stage = shrinkStageRef.current;
      const tile = targetTileRef.current;
      const frame = frameRef.current;
      if (!stage || !tile || !frame) {
        raf = requestAnimationFrame(run);
        return;
      }
      const r = tile.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) {
        raf2 = requestAnimationFrame(() => {
          if (cancelled) return;
          const r2 = targetTileRef.current?.getBoundingClientRect();
          const st = shrinkStageRef.current;
          const fr = frameRef.current;
          if (!r2 || r2.width < 2 || !st || !fr) {
            setInbound(null);
            setRevealContent(true);
            return;
          }
          play(st, r2);
        });
        return;
      }
      play(stage, r);
    };

    function play(stageEl: HTMLDivElement, rect: DOMRect) {
      const F = frameRef.current?.getBoundingClientRect();
      if (!F || F.width < 8 || F.height < 8) {
        setInbound(null);
        setRevealContent(true);
        return;
      }
      const s = Math.max(rect.width / F.width, rect.height / F.height);
      const tx = rect.left + rect.width / 2 - (F.left + F.width / 2);
      const ty = rect.top + rect.height / 2 - (F.top + F.height / 2);
      gsap.set(stageEl, { x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" });
      tween = gsap.to(stageEl, {
        x: tx,
        y: ty,
        scale: s,
        duration: SHRINK_MS,
        ease: SHRINK_EASE,
        onComplete: () => {
          if (cancelled) return;
          setInbound(null);
          setRevealContent(true);
        },
      });
    }

    raf = requestAnimationFrame(run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      tween?.kill();
    };
  }, [inbound]);

  const overlay =
    inbound && typeof document !== "undefined"
      ? createPortal(
        <div className={WORK_ROUTE_FRAME_OUTER}>
          <div ref={frameRef} className={WORK_ROUTE_FRAME_INNER}>
            <div ref={shrinkStageRef} className="absolute inset-0 will-change-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inbound.imageSrc}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        </div>,
        document.body
      )
      : null;

  const hideTargetUnderOverlay = Boolean(inbound) && !revealContent;

  return (
    <>
      {overlay}
      <main
        className={`  transition-opacity duration-200 ${revealContent ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        aria-hidden={!revealContent}
      >
        <div className="h-screen w-full pt-14 px-48 pb-24">
          <div className="relative h-full w-full overflow-hidden bg-black">
            {isVideoMediaPath(posterSrc) ? (
              <video
                src={publicSrc(posterSrc)}
                className="h-full w-full object-cover"
                controls
                playsInline
                muted
                loop
                autoPlay
                aria-label={name.trim()}
              />
            ) : (
              <Image
                src={publicSrc(posterSrc)}
                alt={name.trim()}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            )}
          </div>
        </div>

        <header className="mb-10 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{heading}</h1>
          {body ? <p className="max-w-prose text-sm leading-relaxed text-zinc-600">{body}</p> : null}
        </header>

        {imagePaths.length === 0 ? (
          <p className="text-sm text-zinc-500">No images for this entry.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {imagePaths.map((src, i) => (
              <li
                key={`${src}-${i}`}
                ref={i === targetIdx ? targetTileRef : undefined}
                className={`relative aspect-square overflow-hidden rounded-lg bg-zinc-100 ${hideTargetUnderOverlay && i === targetIdx ? "opacity-0" : ""
                  }`}
              >
                {isVideoMediaPath(src) ? (
                  <video
                    src={publicSrc(src)}
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    muted
                    loop
                    autoPlay
                    aria-label={`${name.trim()} — ${i + 1}`}
                  />
                ) : (
                  <Image
                    src={publicSrc(src)}
                    alt={`${name.trim()} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                    priority={i === targetIdx}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
