const MONTHS_BACK = 11;
const MONTHS_AHEAD = 1;
const TZ = "Europe/Paris";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** First day (UTC) of the month a date belongs to. */
export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

/** First day (UTC) of the following month. */
export function startOfNextMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

/** `MM-YYYY` slug (1-indexed month). */
export function monthSlug(date: Date): string {
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${month}-${date.getUTCFullYear()}`;
}

/** Parse a `MM-YYYY` slug into the first day of that month, or null if invalid. */
export function parseMonthSlug(slug: string | undefined): Date | null {
  if (!slug) return null;
  const match = /^(\d{1,2})-(\d{4})$/.exec(slug);
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const year = Number(match[2]);
  if (month < 0 || month > 11) return null;
  return new Date(Date.UTC(year, month, 1));
}

export function currentMonthSlug(): string {
  return monthSlug(startOfMonth(new Date()));
}

/** Today's calendar date in Paris, as UTC midnight. */
export function todayInParis(): Date {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parseDateSlug(iso)!;
}

/** `YYYY-MM-DD` slug. */
export function dateSlug(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse a `YYYY-MM-DD` slug into UTC midnight, or null if invalid. */
export function parseDateSlug(slug: string | undefined): Date | null {
  if (!slug) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(slug);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

/** "Aujourd'hui" or "Lundi 16 juin". */
export function formatDayLabel(date: Date, today = todayInParis()): string {
  if (dateSlug(date) === dateSlug(today)) return "Aujourd'hui";
  return capitalize(
    new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(date),
  );
}

/** "Juin 2026" */
export function formatMonthLabel(date: Date): string {
  return capitalize(
    new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
  );
}

/** Monday-first weekday labels. */
export const WEEKDAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

/**
 * Calendar grid for a month, as weeks of day numbers (Monday-first).
 * `0` marks padding cells outside the month.
 */
export function monthGrid(month: Date): number[][] {
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const firstWeekday = (new Date(Date.UTC(year, monthIndex, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  const cells: number[] = Array(firstWeekday).fill(0);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(0);
  }

  const weeks: number[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

export type MonthOption = {
  slug: string;
  label: string;
};

/** Selectable months, from one month ahead down to eleven months back. */
export function monthOptions(reference = new Date()): MonthOption[] {
  const base = startOfMonth(reference);
  const options: MonthOption[] = [];
  for (let offset = MONTHS_AHEAD; offset >= -MONTHS_BACK; offset--) {
    const date = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + offset, 1));
    options.push({ slug: monthSlug(date), label: formatMonthLabel(date) });
  }
  return options;
}
