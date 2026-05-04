import type { CSSProperties } from "react";

/** Banner tile placement on `<main>` CSS grid (line indices match grid line numbers). */

export type GridSlot = {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
};

export function gridSlotStyle(s: GridSlot): CSSProperties {
  return {
    gridColumn: `${s.colStart} / span ${s.colSpan}`,
    gridRow: `${s.rowStart} / span ${s.rowSpan}`,
  };
}

/**
 * Banner cells at these `{rowStart}/{colStart}` grid lines stay empty (no card, no assignment).
 */
const EXCLUDED_BANNER_ORIGINS = new Set<string>([
  "3/14",
  "11/14",
  "19/14",
  "3/26",
  "11/26",
  "19/26",
  "3/38",
  "11/38",
  "19/38",
  "3/50",
  "11/50",
  "19/50",
  "3/62",
  "11/62",
]);

export function isExcludedBannerPlacement(slot: GridSlot): boolean {
  return EXCLUDED_BANNER_ORIGINS.has(`${slot.rowStart}/${slot.colStart}`);
}

const COL_SPAN = 12;
const ROW_SPAN = 8;

/** Row bands (step 8) that fit in 58 rows. */
const ROWS_7 = [3, 11, 19, 27, 35, 43, 51] as const;

/** Same bands minus row line 27 — that row band is reserved for `.text-field`. */
const ROWS_NO_27 = [3, 11, 19, 35, 43, 51] as const;

function slots(colStart: number, rows: readonly number[]): GridSlot[] {
  return rows.map((rowStart) => ({
    colStart,
    rowStart,
    colSpan: COL_SPAN,
    rowSpan: ROW_SPAN,
  }));
}

/**
 * Hero occupies grid lines col [29, 65), row [27, 35).
 * No banner slot may overlap that rectangle (nothing sits “in” the text box).
 */
export const TEXT_FIELD_SLOT: GridSlot = {
  colStart: 26,
  rowStart: 27,
  colSpan: 36,
  rowSpan: ROW_SPAN,
};

/** Col 2 & 14 are fully left of col 29 — all 7 bands OK. */
/** Col 26 overlaps hero cols only on [29,38): skip row 27 (same band as hero). */
/** Col 38 is entirely inside hero cols — omit column 38 entirely. */
const beforeText = [
  ...slots(2, ROWS_7),
  ...slots(14, ROWS_7),
  ...slots(26, ROWS_NO_27),
  ...slots(38, ROWS_NO_27),
] as const;

/** Cols 50, 62, 74 overlap hero horizontally — skip row 27 on each. */
const afterText = [
  ...slots(50, ROWS_NO_27),
  ...slots(62, ROWS_NO_27),
  ...slots(74, ROWS_NO_27),
] as const;

export const TEXT_FIELD_BEFORE_COUNT = beforeText.length;

export const BANNER_GRID_SLOTS: GridSlot[] = [...beforeText, ...afterText];
