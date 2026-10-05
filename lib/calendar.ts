import { env } from "./env";
import { startOfMonth, startOfNextMonth } from "./dates";

const DAY_MS = 86_400_000;
const CONFIRMED_STATUSES = new Set(["CONFIRMED", "TENTATIVE"]);

type CalendarEvent = {
  status: string;
  summary: string;
  start: Date;
  /** Exclusive upper-bound day (Google all-day `DTEND` is already exclusive). */
  endExclusive: Date;
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

function publicIcalUrl(calendarId: string): string {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(
    calendarId,
  )}/public/basic.ics`;
}

/** Unfold RFC 5545 line folding and split into lines. */
function unfold(ics: string): string[] {
  const lines: string[] = [];
  for (const raw of ics.split(/\r?\n/)) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += raw.slice(1);
    } else {
      lines.push(raw);
    }
  }
  return lines;
}

function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/** Parse `YYYYMMDD` or `YYYYMMDDTHHMMSSZ` into UTC midnight of that calendar day. */
function parseIcalDay(value: string): Date | null {
  const match = /^(\d{4})(\d{2})(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
}

function parseIcalDateTime(value: string): Date | null {
  const match =
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
  if (!match) return null;
  if (match[7] === "Z") {
    return new Date(
      Date.UTC(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6]),
      ),
    );
  }
  // Floating local times are rare here; treat as UTC calendar day.
  return parseIcalDay(value);
}

function parseProperty(line: string): { name: string; value: string } | null {
  const colon = line.indexOf(":");
  if (colon < 0) return null;
  const name = line.slice(0, colon).split(";", 1)[0].toUpperCase();
  return { name, value: line.slice(colon + 1) };
}

function parseEvents(ics: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  let inEvent = false;
  let status = "CONFIRMED";
  let summary = "";
  let startRaw: string | null = null;
  let endRaw: string | null = null;
  let endIsDate = false;

  const reset = () => {
    status = "CONFIRMED";
    summary = "";
    startRaw = null;
    endRaw = null;
    endIsDate = false;
  };

  for (const line of unfold(ics)) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      reset();
      continue;
    }
    if (!inEvent) continue;

    if (line === "END:VEVENT") {
      inEvent = false;
      if (
        summary &&
        startRaw &&
        endRaw &&
        CONFIRMED_STATUSES.has(status.toUpperCase())
      ) {
        const start = parseIcalDay(startRaw);
        let endExclusive: Date | null = null;
        if (endIsDate) {
          endExclusive = parseIcalDay(endRaw);
        } else {
          const exact = parseIcalDateTime(endRaw);
          const midnight = parseIcalDay(endRaw);
          if (exact && midnight) {
            endExclusive =
              exact.getTime() > midnight.getTime()
                ? new Date(midnight.getTime() + DAY_MS)
                : midnight;
          }
        }

        if (start && endExclusive) {
          events.push({
            status: status.toUpperCase(),
            summary: unescapeText(summary),
            start,
            endExclusive,
          });
        }
      }
      continue;
    }

    const property = parseProperty(line);
    if (!property) continue;

    switch (property.name) {
      case "SUMMARY":
        summary = property.value;
        break;
      case "STATUS":
        status = property.value;
        break;
      case "DTSTART":
        startRaw = property.value;
        break;
      case "DTEND": {
        endRaw = property.value;
        endIsDate =
          line.toUpperCase().includes("VALUE=DATE") ||
          /^\d{8}$/.test(property.value);
        break;
      }
    }
  }

  return events;
}

/** Strip the desk mention, e.g. "Alice (bureau 2)" -> "Alice". */
function nomadName(summary: string): string {
  return summary.split(" (")[0].trim();
}

function expandEvent(
  event: CalendarEvent,
  firstDay: Date,
  lastDay: Date,
): Date[] {
  const from = Math.max(event.start.getTime(), firstDay.getTime());
  const to = Math.min(event.endExclusive.getTime(), lastDay.getTime());

  const days: Date[] = [];
  for (let time = from; time < to; time += DAY_MS) {
    days.push(new Date(time));
  }
  return days;
}

async function fetchPublicEvents(): Promise<CalendarEvent[]> {
  const response = await fetch(publicIcalUrl(env.calendarId), {
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(
      `Google Calendar iCal request failed (${response.status} ${response.statusText})`,
    );
  }
  return parseEvents(await response.text());
}

export async function getReservations(month: Date): Promise<ReservationSummary> {
  const firstDay = startOfMonth(month);
  const lastDay = startOfNextMonth(month);
  const events = await fetchPublicEvents();

  const byName = new Map<string, Date[]>();

  for (const event of events) {
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

export async function getNomadsForDay(date: Date): Promise<string[]> {
  const { nomads } = await getReservations(startOfMonth(date));
  const day = date.getUTCDate();
  return nomads
    .filter((nomad) => nomad.days.includes(day))
    .map((nomad) => nomad.name)
    .sort((a, b) => a.localeCompare(b, "fr"));
}
