import { env } from "./env";
import { startOfMonth, startOfNextMonth } from "./dates";

const DAY_MS = 86_400_000;
const CONFIRMED_STATUSES = new Set(["confirmed", "tentative"]);

type GoogleEventDate = {
  date?: string;
  dateTime?: string;
};

type GoogleEvent = {
  status?: string;
  summary?: string;
  start?: GoogleEventDate;
  end?: GoogleEventDate;
};

type GoogleEventsResponse = {
  items?: GoogleEvent[];
};

export type Nomad = {
  name: string;
  count: number;
  days: number[];
};

export type ReservationSummary = {
  totalReservations: number;
  nomads: Nomad[];
};

function toUtcMidnight(value: string): Date {
  const parsed = new Date(value);
  return new Date(
    Date.UTC(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
    ),
  );
}

function startDay(event: GoogleEvent): Date | null {
  const value = event.start?.date ?? event.start?.dateTime;
  return value ? toUtcMidnight(value) : null;
}

/** Exclusive upper-bound day for an event (Google all-day `end.date` is already exclusive). */
function endDayExclusive(event: GoogleEvent): Date | null {
  if (event.end?.date) {
    return toUtcMidnight(event.end.date);
  }
  if (event.end?.dateTime) {
    const midnight = toUtcMidnight(event.end.dateTime);
    const exact = new Date(event.end.dateTime);
    return exact.getTime() > midnight.getTime()
      ? new Date(midnight.getTime() + DAY_MS)
      : midnight;
  }
  return null;
}

/** Strip the desk mention, e.g. "Alice (bureau 2)" -> "Alice". */
function nomadName(summary: string): string {
  return summary.split(" (")[0].trim();
}

function expandEvent(event: GoogleEvent, firstDay: Date, lastDay: Date): Date[] {
  const start = startDay(event);
  const end = endDayExclusive(event);
  if (!start || !end) return [];

  const from = Math.max(start.getTime(), firstDay.getTime());
  const to = Math.min(end.getTime(), lastDay.getTime());

  const days: Date[] = [];
  for (let time = from; time < to; time += DAY_MS) {
    days.push(new Date(time));
  }
  return days;
}

export async function getReservations(month: Date): Promise<ReservationSummary> {
  const firstDay = startOfMonth(month);
  const lastDay = startOfNextMonth(month);

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      env.calendarId,
    )}/events`,
  );
  url.searchParams.set("key", env.googleApiKey);
  url.searchParams.set("timeMin", firstDay.toISOString());
  url.searchParams.set("timeMax", lastDay.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("showDeleted", "false");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "2500");

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(
      `Google Calendar request failed (${response.status} ${response.statusText})`,
    );
  }

  const data = (await response.json()) as GoogleEventsResponse;
  const events = data.items ?? [];

  const byName = new Map<string, Date[]>();

  for (const event of events) {
    if (!event.status || !CONFIRMED_STATUSES.has(event.status)) continue;
    if (!event.summary) continue;

    const days = expandEvent(event, firstDay, lastDay);
    if (days.length === 0) continue;

    const name = nomadName(event.summary);
    if (!name) continue;

    const existing = byName.get(name);
    if (existing) {
      existing.push(...days);
    } else {
      byName.set(name, [...days]);
    }
  }

  let totalReservations = 0;
  const nomads: Nomad[] = [];

  for (const [name, dates] of byName) {
    dates.sort((a, b) => a.getTime() - b.getTime());
    totalReservations += dates.length;
    const days = [...new Set(dates.map((date) => date.getUTCDate()))];
    nomads.push({ name, count: dates.length, days });
  }

  nomads.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));

  return { totalReservations, nomads };
}
