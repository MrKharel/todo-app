const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" });

/** The Rust backend stores unix timestamps in seconds; `Date` expects milliseconds. */
export function formatTimestamp(seconds: number): string {
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? "Unknown" : formatter.format(date);
}
