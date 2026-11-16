const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const dateWithYearFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

interface FormatTimestampOptions {
  /** Show hours:minutes:seconds. Defaults to true. */
  showTime?: boolean;
}

/** The Rust backend stores unix timestamps in seconds; `Date` expects milliseconds. */
/**
 * Formats a timestamp as "Today", "Yesterday", "Tomorrow", or a date.
 * - Includes time (hours:minutes:seconds) by default; pass `showTime: false` to hide it.
 * - Includes the year only when the date is in a different year than now.
 */
export function formatTimestamp(seconds: number, { showTime = true }: FormatTimestampOptions = {}): string {
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const now = new Date();

  // Normalize both dates to local midnight for day-diff comparison.
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / (1000 * 60 * 60 * 24));

  let dayLabel: string;
  if (diffDays === 0) {
    dayLabel = "Today";
  } else if (diffDays === -1) {
    dayLabel = "Yesterday";
  } else if (diffDays === 1) {
    dayLabel = "Tomorrow";
  } else {
    dayLabel =
      date.getFullYear() === now.getFullYear() ? dateFormatter.format(date) : dateWithYearFormatter.format(date);
  }

  return showTime ? `${dayLabel}, ${timeFormatter.format(date)}` : dayLabel;
}
