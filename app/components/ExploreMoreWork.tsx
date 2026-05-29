"use client";

import Link from "next/link";
import { useState } from "react";

import { getWorkSlug, type ExploreWorkItem } from "@/lib/homeData";

type Props = {
  items: ExploreWorkItem[];
  theme: boolean
};

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

export default function ExploreMoreWork({ items, theme }: Props) {
  const [hoverSrc, setHoverSrc] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <div className={`mx-auto my-44 w-full`}>
      <Link href="/work" className={`text-sm  hover:underline w-fit  ${theme ? "text-(--offWhite) " : "text-(--charcoleBlack) font-bold"}`}>
        Explore More Work
      </Link>
      <div
        className={`relative isolate flex min-h-50 flex-col overflow-hidden py-6 px-10 ${theme ? "text-(--offWhite)" : "text-(--charcoleBlack) "}`}
        onPointerLeave={() => setHoverSrc(null)}
      >
        {hoverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- width:auto + blend with link text
          <img
            src={publicSrc(hoverSrc)}
            alt=""
            className="pointer-events-none absolute right-0 top-1/2 z-0 block h-auto w-auto min-h-50 max-h-62.5 -translate-y-1/2 object-contain"
          />
        ) : null}
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/work/${getWorkSlug(item)}`}
            className={`relative z-10 w-fit text-7xl font-light  leading-tight underline-offset-4 decoration-2 hover:underline `}
            onPointerEnter={() => setHoverSrc(item.image)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
