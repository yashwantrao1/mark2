export const WORK_ROUTE_TRANSITION_STORAGE_KEY = "mark2-work-route-transition-v1";

export type WorkRouteTransitionPayload = {
  v: 1;
  slug: string;
  imageSrc: string;
};

export function normalizePublicSrc(src: string): string {
  const t = src.trim();
  if (!t) return "";
  return t.startsWith("/") ? t : `/${t}`;
}

export function writeWorkRouteTransition(payload: WorkRouteTransitionPayload) {
  try {
    sessionStorage.setItem(WORK_ROUTE_TRANSITION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* private mode / quota */
  }
}

export function readWorkRouteTransition(): WorkRouteTransitionPayload | null {
  try {
    const raw = sessionStorage.getItem(WORK_ROUTE_TRANSITION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as WorkRouteTransitionPayload;
    if (data?.v !== 1 || typeof data.slug !== "string" || typeof data.imageSrc !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export function clearWorkRouteTransition() {
  try {
    sessionStorage.removeItem(WORK_ROUTE_TRANSITION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
