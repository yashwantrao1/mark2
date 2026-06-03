"use client";

import { useLenis } from "lenis/react";
import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";

import { getWebGLMediaEngine } from "@/lib/webgl/WebGLMediaEngine";

export default function WebGLMediaProvider({ children }: { children: ReactNode }) {
  const cleanupRef = useRef<(() => void) | null>(null);

  const mountCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      return;
    }
    cleanupRef.current = getWebGLMediaEngine().mount(canvas) ?? null;
  }, []);

  useLenis(({ velocity }) => {
    getWebGLMediaEngine().setScrollVelocity(velocity);
  });

  useLayoutEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      getWebGLMediaEngine().setCursorTarget(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {children}
      <canvas
        ref={mountCanvas}
        className="pointer-events-none fixed inset-0 z-30 h-full w-full"
        aria-hidden
      />
    </>
  );
}
