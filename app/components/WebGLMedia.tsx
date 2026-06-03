"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useLayoutEffect, useRef } from "react";

import {
  getWebGLMediaEngine,
  type WebGLMediaHandle,
} from "@/lib/webgl/WebGLMediaEngine";

gsap.registerPlugin(CustomEase);

const hoverEase = CustomEase.create("custom", "0.4, 0, 0.2, 1");

type Props = {
  src: string;
  alt?: string;
  className?: string;
  video?: boolean;
  distortion?: boolean;
};

export default function WebGLMedia({
  src,
  alt = "",
  className = "",
  video = false,
  distortion = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const handleRef = useRef<WebGLMediaHandle | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const media = mediaRef.current;
    if (!container || !media) return;

    let cancelled = false;
    let raf = 0;

    const tryRegister = () => {
      if (cancelled) return;
      handleRef.current = getWebGLMediaEngine().register(container, media, video, distortion);
      if (!handleRef.current) raf = requestAnimationFrame(tryRegister);
    };

    tryRegister();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (handleRef.current) {
        getWebGLMediaEngine().unregister(handleRef.current.id);
        handleRef.current = null;
      }
    };
  }, [src, video, distortion]);

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const handle = handleRef.current;
    if (!handle) return;
    gsap.to(handle, { mouseEnter: 1, duration: 0.6, ease: hoverEase });
    if (distortion) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      getWebGLMediaEngine().setDistortionMouseImmediate(handle.id, x, y);
    }
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const handle = handleRef.current;
    if (!handle) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;
    handle.mouseOverPos.target.x = x;
    handle.mouseOverPos.target.y = y;
    if (distortion) getWebGLMediaEngine().setDistortionMouse(handle.id, x, y);
  };

  const onLeave = () => {
    const handle = handleRef.current;
    if (!handle) return;
    gsap.to(handle, { mouseEnter: 0, duration: 0.6, ease: hoverEase });
    gsap.to(handle.mouseOverPos.target, {
      x: 0.5,
      y: 0.5,
      duration: 0.6,
      ease: hoverEase,
    });
    if (distortion) getWebGLMediaEngine().setDistortionMouseLeave(handle.id);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {video ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className="pointer-events-none block h-auto w-full opacity-0"
          crossOrigin="anonymous"
          muted
          loop
          playsInline
        />
      ) : (
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={src}
          alt={alt}
          className="pointer-events-none block h-auto w-full opacity-0 "
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}
