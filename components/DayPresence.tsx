import { Suspense } from "react";
import { DayPicker } from "@/components/DayPicker";
import { getNomadsForDay } from "@/lib/calendar";
import { dateSlug, formatDayLabel } from "@/lib/dates";

const CHIP_STYLES = [
  "bg-buttercup text-white",
  "bg-grape text-white",
  "bg-sky text-ink",
  "bg-salmon text-ink",
];

async function DayPresenceContent({ date }: { date: Date }) {
  let names: string[];
  try {
    names = await getNomadsForDay(date);
  } catch {
    return (
      <p className="text-sm text-salmon">Impossible de charger les présences.</p>
    );
  }

  if (names.length === 0) {
    return (
      <p className="text-sm text-ink-soft">Personne au coworking ce jour-là.</p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {names.map((name, index) => (
        <li
          key={name}
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            CHIP_STYLES[index % CHIP_STYLES.length]
          }`}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

function DayPresenceSkeleton() {
  return (
    <div className="flex gap-1.5">
      <div className="h-7 w-20 animate-pulse rounded-full bg-cream-deep/80" />
      <div className="h-7 w-16 animate-pulse rounded-full bg-cream-deep/80" />
      <div className="h-7 w-24 animate-pulse rounded-full bg-cream-deep/80" />
    </div>
  );
}

export function DayPresence({ date }: { date: Date }) {
  return (
    <div className="mt-4 w-fit max-w-full rounded-card border border-line bg-white px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Au coworking
          </span>
        </span>
        <Suspense fallback={null}>
          <DayPicker label={formatDayLabel(date)} value={dateSlug(date)} />
        </Suspense>
      </div>

      <div className="mt-3 flex min-h-8 items-center">
        <Suspense fallback={<DayPresenceSkeleton />}>
          <DayPresenceContent date={date} />
        </Suspense>
      </div>
    </div>
  );
}
