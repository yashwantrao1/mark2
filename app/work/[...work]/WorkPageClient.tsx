"use client";

import Image from "next/image";

import { MediaHoverGlitch } from "@/app/components/MediaHoverGlitch";
import ExploreMoreWork from "@/app/components/ExploreMoreWork";
import type { ExploreWorkItem } from "@/lib/homeData";
import { isVideoMediaPath } from "@/lib/mediaPaths";
import WorkWithUs from "@/app/components/WorkWithUs";

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

type Props = {
  heading: string;
  body: string;
  imagePaths: string[];
  name: string;
  posterSrc: string;
  leftCopy: string;
  rightCopy: string;
  theme: boolean;
  exploreItems: ExploreWorkItem[];
};

function WorkMedia({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  if (isVideoMediaPath(src)) {
    return (
      <video
        src={publicSrc(src)}
        className={className}
        controls
        playsInline
        muted
        loop
        autoPlay
        aria-label={alt}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={publicSrc(src)}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={publicSrc(src)}
      alt={alt}
      width={width ?? 1000}
      height={height ?? 600}
      className={className}
    />
  );
}

export default function WorkPageClient({
  leftCopy,
  rightCopy,
  heading,
  body,
  imagePaths,
  name,
  posterSrc,
  theme,
  exploreItems,
}: Props) {
  const label = name.trim();

  return (
    <main className={`mx-auto  px-44 py-14 w-full ${theme ? 'bg-zinc-950' : ''}`}>
      <MediaHoverGlitch mediaFill className="w-full overflow-hidden aspect-video mb-4">
        <WorkMedia
          src={posterSrc}
          alt={label}
          fill={!isVideoMediaPath(posterSrc)}
          className={
            isVideoMediaPath(posterSrc) ? "h-full w-full object-cover" : "object-cover"
          }
          sizes="100vw"
          priority
        />
      </MediaHoverGlitch>

      {imagePaths.length === 0 ? (
        <p className="text-sm text-zinc-500">No images for this entry.</p>
      ) : (
        <div className="columns-2 gap-4">
          {imagePaths.map((src, i) => (
            <MediaHoverGlitch key={`${src}-${i}`} className="overflow-hidden mb-4">
              <WorkMedia
                src={src}
                alt={`${label} — ${i + 1}`}
                className={
                  isVideoMediaPath(src)
                    ? "w-full h-auto object-contain relative"
                    : "w-full h-full"
                }
              />
            </MediaHoverGlitch>
          ))}
        </div>
      )}

      <div className={`my-44 w-full  flex items-center justify-center ${theme ? "text-(--offWhite)" : "text-(--charcoleBlack)"}`}>
        <h1 className="font-heading text-[12vw]  text-center leading-none">
          {heading}
        </h1>
      </div>
      <div className={`${leftCopy && rightCopy ? "grid grid-cols-2 gap-4 my-44 $ " : "flex flex-col gap-4 my-44"}`}>
        {leftCopy && <div className={`${theme ? 'text-(--offWhite)' : 'text-(--charcoleBlack) font-bold'}`} dangerouslySetInnerHTML={{ __html: leftCopy }} />}
        {rightCopy && <div className={`${theme ? 'text-(--offWhite)' : 'text-(--charcoleBlack) font-bold'}`} dangerouslySetInnerHTML={{ __html: rightCopy }} />}
      </div>

      <ExploreMoreWork items={exploreItems} theme={theme} />
      <WorkWithUs theme={theme} />
    </main>
  );
}
