"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { WORK_ROUTE_FRAME_INNER, WORK_ROUTE_FRAME_OUTER } from "@/lib/workRouteFrame";
import { writeWorkRouteTransition, type WorkRouteTransitionPayload } from "@/lib/workRouteTransition";

type Job = {
  slug: string;
  imageSrc: string;
  rect: DOMRectReadOnly;
  tileIndex: number;
};

type TransitionContextValue = {
  startOutboundWorkNavigation: (
    slug: string,
    imageSrc: string,
    anchorEl: HTMLElement,
    tileIndex: number
  ) => void;
  activeTileIndex: number | null;
};

const WorkRouteTransitionContext = createContext<TransitionContextValue | null>(null);

const EXPAND_MS = 0.58;
const EXPAND_EASE = "power3.inOut";

function WorkExpandPortal({ job, onComplete }: { job: Job; onComplete: (slug: string) => void }) {
  const innerFrameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let raf = 0;
    let frames = 0;
    const maxFrames = 120;
    let tween: gsap.core.Tween | null = null;

    const tick = () => {
      if (cancelled) return;
      frames += 1;
      const inner = innerFrameRef.current;
      if (!inner || frames > maxFrames) {
        const payload: WorkRouteTransitionPayload = { v: 1, slug: job.slug, imageSrc: job.imageSrc };
        writeWorkRouteTransition(payload);
        doneRef.current(job.slug);
        return;
      }
      const last = inner.getBoundingClientRect();
      if (last.width < 8 || last.height < 8) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const first = job.rect;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const scaleX = first.width / last.width;
      const scaleY = first.height / last.height;

      gsap.set(stage, { x: dx, y: dy, scaleX, scaleY, transformOrigin: "0 0" });

      tween = gsap.to(stage, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: EXPAND_MS,
        ease: EXPAND_EASE,
        onComplete: () => {
          if (cancelled) return;
          const payload: WorkRouteTransitionPayload = { v: 1, slug: job.slug, imageSrc: job.imageSrc };
          writeWorkRouteTransition(payload);
          doneRef.current(job.slug);
        },
      });
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      tween?.kill();
    };
  }, [job]);

  const portal =
    typeof document !== "undefined"
      ? createPortal(
          <div className={WORK_ROUTE_FRAME_OUTER} aria-hidden>
            <div ref={innerFrameRef} className={WORK_ROUTE_FRAME_INNER}>
              <div ref={stageRef} className="absolute inset-0 will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element -- transition continuity; same URL as tile */}
                <img src={job.imageSrc} alt="" className="h-full w-full object-cover" draggable={false} />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return portal;
}

export function WorkOutboundTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);

  const startOutboundWorkNavigation = useCallback(
    (slug: string, imageSrc: string, anchorEl: HTMLElement, tileIndex: number) => {
      const rect = anchorEl.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        router.push(`/work/${slug}`);
        return;
      }
      setJob({ slug, imageSrc, rect, tileIndex });
    },
    [router]
  );

  const value = useMemo<TransitionContextValue>(
    () => ({
      startOutboundWorkNavigation,
      activeTileIndex: job?.tileIndex ?? null,
    }),
    [job, startOutboundWorkNavigation]
  );

  return (
    <WorkRouteTransitionContext.Provider value={value}>
      {children}
      {job ? (
        <WorkExpandPortal
          key={`${job.slug}-${job.imageSrc}-${job.tileIndex}`}
          job={job}
          onComplete={(slug) => {
            setJob(null);
            router.push(`/work/${slug}`);
          }}
        />
      ) : null}
    </WorkRouteTransitionContext.Provider>
  );
}

export function useWorkOutboundTransition() {
  return useContext(WorkRouteTransitionContext);
}
