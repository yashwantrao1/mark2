import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCellImagePaths,
  getHomeCellByRouteKey,
  pickRandomExploreItems,
  routeSegmentsToKey,
  type HomeCell,
} from "@/lib/homeData";

import WorkPageClient from "./WorkPageClient";

type Props = {
  params: Promise<{ work: string[] | undefined }>;
};

function publicSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

function resolveWorkTitle(cell: HomeCell) {
  return cell.title?.trim() || cell.metaTitle?.trim() || cell.name.trim() || "Work";
}

function resolveWorkDescription(cell: HomeCell) {
  return cell.metaDescription?.trim() || cell.description?.trim() || "";
}

function resolveWorkLeftCopy(cell: HomeCell) {
  return cell.leftCopy?.trim() || "";
}
function resolveWorkRightCopy(cell: HomeCell) {
  return cell.rightCopy?.trim() || "";
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
  const leftCopy = resolveWorkLeftCopy(cell);
  const rightCopy = resolveWorkRightCopy(cell);
  const posterSrc = publicSrc(cell.image);

  const exploreItems = pickRandomExploreItems(cell.link);

  return (
    <WorkPageClient
      leftCopy={leftCopy}
      rightCopy={rightCopy}
      heading={heading}
      body={body}
      imagePaths={imagePaths}
      name={cell.name}
      posterSrc={posterSrc}
      exploreItems={exploreItems}
    />
  );
}
