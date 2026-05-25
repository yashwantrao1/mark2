"use client";

import Link from "next/link";
import { useState } from "react";

import { getWorkSlug, type ExploreWorkItem } from "@/lib/homeData";

type Props = {
  items: ExploreWorkItem[];
};

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ExploreMoreWork({ items }: Props) {
  const [hoverSrc, setHoverSrc] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="mx-auto my-44 w-full">
      <Link href="/work" className="text-sm font-bold hover:underline w-fit">
        Explore More Work
      </Link>
      <div
        className="relative isolate flex min-h-[200px] flex-col overflow-hidden py-6 px-10"
        onPointerLeave={() => setHoverSrc(null)}
      >
        {hoverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- width:auto + blend with link text
          <img
            src={publicSrc(hoverSrc)}
            alt=""
            className="pointer-events-none absolute right-0 top-1/2 z-0 block h-auto w-auto min-h-[200px] max-h-[250px] -translate-y-1/2 object-contain mix-blend-exclusion"
          />
        ) : null}
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/work/${getWorkSlug(item)}`}
            className="relative z-10 w-fit text-7xl font-light font-heading leading-tight underline-offset-4 decoration-2 hover:underline"
            onPointerEnter={() => setHoverSrc(item.image)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
