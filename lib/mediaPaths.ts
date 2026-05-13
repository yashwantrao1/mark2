/** Public `home.json` paths like `img/foo.mp4` — not URL query-heavy, filename only. */
const VIDEO_FILENAME_RE = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

export function isVideoMediaPath(src: string): boolean {
  const base = src.trim().split("/").pop() ?? src;
  return VIDEO_FILENAME_RE.test(base);
}
