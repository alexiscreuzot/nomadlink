import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { MonthSelector } from "@/components/MonthSelector";
import { NomadList } from "@/components/NomadList";
import { StatsBanner } from "@/components/StatsBanner";
import { getReservations } from "@/lib/calendar";
import {
  monthOptions,
  monthSlug,
  parseDateSlug,
  parseMonthSlug,
  startOfMonth,
  todayInParis,
} from "@/lib/dates";

type SearchParams = Promise<{ m?: string; d?: string }>;

const MIN_LOADER_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function Reservations({ month }: { month: Date }) {
  let data;
  try {
    const [result] = await Promise.all([
      getReservations(month),
      sleep(MIN_LOADER_MS),
    ]);
    data = result;
  } catch {
    return (
      <div className="rounded-card bg-white p-10 text-center shadow-soft">
        <p className="text-lg font-semibold text-salmon">
          Impossible de charger les réservations.
        </p>
        <p className="mt-1 text-ink-soft">
          Réessaie dans un instant ou vérifie la configuration du calendrier.
        </p>
      </div>
    );
  }

  return (
    <NomadList
      nomads={data.nomads}
      month={month}
      stats={
        <StatsBanner
          totalReservations={data.totalReservations}
          nomadCount={data.nomads.length}
        />
      }
    />
  );
}

function ReservationsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="h-12 w-56 animate-pulse rounded-full bg-white/70" />
        <div className="h-12 flex-1 animate-pulse rounded-full bg-white/70" />
      </div>
      <ol className="flex flex-col gap-1.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <li
            key={index}
            className="rounded-2xl bg-white px-4 py-3.5 shadow-soft sm:px-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-4 w-5 animate-pulse rounded bg-cream-deep" />
              <div className="h-5 w-2/5 animate-pulse rounded bg-cream-deep" />
              <div className="ml-auto h-6 w-14 animate-pulse rounded bg-cream-deep" />
            </div>
            <div className="mt-3 ml-8 h-1.5 animate-pulse rounded-full bg-cream-deep" />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { m, d } = await searchParams;
  const month = parseMonthSlug(m) ?? startOfMonth(new Date());
  const day = parseDateSlug(d) ?? todayInParis();
  const selectedSlug = monthSlug(month);
  const options = monthOptions();

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-5 py-12 sm:py-16">
      <Hero date={day} />

      <div className="flex justify-center">
        <MonthSelector options={options} selected={selectedSlug} />
      </div>

      <Suspense key={selectedSlug} fallback={<ReservationsSkeleton />}>
        <Reservations month={month} />
      </Suspense>

      <footer className="mt-auto pt-8 text-center text-xs uppercase tracking-[0.2em] text-ink-soft/70">
        © {new Date().getFullYear()} Happy Hours
      </footer>
    </div>
  );
}
