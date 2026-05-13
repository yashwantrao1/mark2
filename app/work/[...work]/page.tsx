import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCellImagePaths, getHomeCellByRouteKey, routeSegmentsToKey, type HomeCell } from "@/lib/homeData";
import { isVideoMediaPath } from "@/lib/mediaPaths";

type Props = {
  params: Promise<{ work: string[] | undefined }>;
};

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

function resolveWorkTitle(cell: HomeCell) {
  return cell.metaTitle?.trim() || cell.title?.trim() || cell.name.trim() || "Work";
}

function resolveWorkDescription(cell: HomeCell) {
  return cell.metaDescription?.trim() || cell.description?.trim() || "";
}

function resolveWorkKeywords(cell: HomeCell) {
  const raw = cell.metaKeywords?.trim();
  if (!raw) return undefined;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = routeSegmentsToKey((await params).work);
  const cell = getHomeCellByRouteKey(key);
  const title = cell ? resolveWorkTitle(cell) : "Work";
  const description = cell ? resolveWorkDescription(cell) : "";
  const keywords = cell ? resolveWorkKeywords(cell) : undefined;
  return {
    title,
    ...(description ? { description } : {}),
    ...(keywords?.length ? { keywords } : {}),
  };
}

export default async function WorkCatchAllPage({ params }: Props) {
  const key = routeSegmentsToKey((await params).work);
  const cell = getHomeCellByRouteKey(key);
  if (!cell) notFound();

  const imagePaths = getCellImagePaths(cell, { dedupe: false });
  const heading = resolveWorkTitle(cell);
  const body = resolveWorkDescription(cell);

  return (
    <main className="mx-auto max-w-5xl px-6 py-28">
     
      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{heading}</h1>
        {body ? (
          <p className="max-w-prose text-sm leading-relaxed text-zinc-600">{body}</p>
        ) : null}
      </header>

      {imagePaths.length === 0 ? (
        <p className="text-sm text-zinc-500">No images for this entry.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imagePaths.map((src, i) => (
            <li key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
              {isVideoMediaPath(src) ? (
                <video
                  src={publicSrc(src)}
                  className="absolute inset-0 h-full w-full object-contain"
                  controls
                  playsInline
                  muted
                  loop
                  autoPlay
                  aria-label={`${cell.name.trim()} — ${i + 1}`}
                />
              ) : (
                <Image
                  src={publicSrc(src)}
                  alt={`${cell.name.trim()} — ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
