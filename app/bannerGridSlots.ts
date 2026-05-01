/** Grid `<div>` classNames for banner tiles, in DOM order (excludes `.text-field` hero). Must match `page.tsx` layout. */
function col(start: string, rows: readonly string[]): string[] {
  return rows.map(
    (row) =>
      `col-span-9 row-span-6 row-start-${row} col-start-${start} `
  );
}

const beforeText = [
  ...col("2", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
  ...col("11", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
  ...col("20", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
  ...col("29", ["3", "9", "15", "21"]),
] as const;

const afterText = [
  ...col("29", ["33", "39", "45", "51"]),
  ...col("38", ["3", "9", "15", "21", "33", "39", "45", "51"]),
  ...col("47", ["3", "9", "15", "21", "33", "39", "45", "51"]),
  ...col("56", ["3", "9", "15", "21", "33", "39", "45", "51"]),
  ...col("65", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
  ...col("74", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
  ...col("83", ["3", "9", "15", "21", "27", "33", "39", "45", "51"]),
] as const;

export const TEXT_FIELD_BEFORE_COUNT = beforeText.length;

export const BANNER_GRID_SLOT_CLASSES: string[] = [
  ...beforeText,
  ...afterText,
];
