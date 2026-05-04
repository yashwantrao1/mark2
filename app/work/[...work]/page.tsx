import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCellImagePaths, getHomeCellByRouteKey, routeSegmentsToKey } from "@/lib/homeData";

type Props = {
  params: Promise<{ work: string[] | undefined }>;
};

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = routeSegmentsToKey((await params).work);
  const cell = getHomeCellByRouteKey(key);
  const titleMeta = cell?.title?.trim() || cell?.name.trim();
  return { title: titleMeta ?? "Work" };
}

export default async function WorkCatchAllPage({ params }: Props) {
  const key = routeSegmentsToKey((await params).work);
  const cell = getHomeCellByRouteKey(key);
  if (!cell) notFound();

  const imagePaths = getCellImagePaths(cell, { dedupe: false });
  const heading = (cell.title ?? cell.name).trim();

  return (
    <main className="mx-auto max-w-5xl px-6 py-28">
      <p className="mb-8">
        <Link href="/" className="underline">
          ← Back
        </Link>
      </p>

      <header className="mb-10 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{heading}</h1>
        {cell.description?.trim() ? (
          <p className="max-w-prose text-sm leading-relaxed text-zinc-600">{cell.description.trim()}</p>
        ) : null}
      </header>

      {imagePaths.length === 0 ? (
        <p className="text-sm text-zinc-500">No images for this entry.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imagePaths.map((src, i) => (
            <li key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={publicSrc(src)}
                alt={`${cell.name.trim()} — ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
