import homeJson from "@/public/home.json";

/** Matches `public/home.json` (optional `key`, legacy `title` / `description`, SEO `meta*` when present). */
export type HomeCell = {
  id: number;
  name: string;
  image: string;
  link: string;
  images?: string[];
  key?: string;
  title?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

export const homeCells: HomeCell[] = homeJson as HomeCell[];

/** Turn catch-all segments into one path key, e.g. `['jkTyre']` → `'jkTyre'`. */
export function routeSegmentsToKey(segments: string[] | undefined): string {
  return segments?.filter(Boolean).join("/").trim() ?? "";
}

/**
 * Resolve catalog row from the URL key.
 * 1. Match `cell.key` when defined (preferred).
 * 2. Else match `cell.link` so entries without `key` still resolve.
 */
export function getHomeCellByRouteKey(routeKey: string): HomeCell | undefined {
  const t = routeKey.trim();
  if (!t) return undefined;

  const byKey = homeCells.find((c) => typeof c.key === "string" && c.key.trim() === t);
  if (byKey) return byKey;

  return homeCells.find((c) => c.link.trim() === t);
}

/** Convenience: params.work → lookup. */
export function getHomeCellByWorkSlugsegments(segments: string[] | undefined): HomeCell | undefined {
  return getHomeCellByRouteKey(routeSegmentsToKey(segments));
}

/** Href segment for a tile: use explicit `key` when set, otherwise `link`. */
export function getWorkSlug(cell: Pick<HomeCell, "key" | "link">): string {
  const k = typeof cell.key === "string" ? cell.key.trim() : "";
  if (k) return k;
  return cell.link.trim();
}

export type GetCellImagePathsOptions = {
  /** When true (default), each path appears once. When false, every entry in `images` becomes a tile (duplicates allowed). */
  dedupe?: boolean;
};

/** All image paths for a catalog row: `images[]` when present, otherwise `[image]`. Order preserved. */
export function getCellImagePaths(cell: HomeCell, options?: GetCellImagePathsOptions): string[] {
  const dedupe = options?.dedupe !== false;
  const raw = cell.images?.length ? [...cell.images] : [cell.image];
  const normalized = raw
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((s): s is string => Boolean(s));
  if (!dedupe) return normalized;

  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of normalized) {
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}
