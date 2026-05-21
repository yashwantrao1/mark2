"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

function LenisResizeOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const frame = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        smoothWheel: true,
        autoRaf: true,
        autoResize: true,
      }}
    >
      <LenisResizeOnNavigate />
      {children}
    </ReactLenis>
  );
}
