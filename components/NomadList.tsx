import type { ReactNode } from "react";
import type { Nomad } from "@/lib/calendar";
import { WEEKDAY_LABELS, monthGrid } from "@/lib/dates";
import { NomadFilter } from "./NomadFilter";
import type { NomadRowProps } from "./NomadRow";

const ACCENTS = [
  { bar: "bg-buttercup", count: "text-buttercup" },
  { bar: "bg-sky", count: "text-sky" },
  { bar: "bg-salmon", count: "text-salmon" },
  { bar: "bg-grape", count: "text-grape" },
];

export function NomadList({
  nomads,
  month,
  stats,
  selector,
}: {
  nomads: Nomad[];
  month: Date;
  stats?: ReactNode;
  selector?: ReactNode;
}) {
  if (nomads.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {stats}
          {selector}
        </div>
        <div className="rounded-card bg-white p-10 text-center shadow-soft">
          <p className="text-lg font-semibold text-ink">Aucune réservation ce mois-ci.</p>
          <p className="mt-1 text-ink-soft">
            Choisis un autre mois pour voir les nomades.
          </p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...nomads.map((nomad) => nomad.count));
  const weeks = monthGrid(month);

  const rows: NomadRowProps[] = nomads.map((nomad, index) => {
    const accent = ACCENTS[index % ACCENTS.length];
    return {
      rank: index + 1,
      name: nomad.name,
      count: nomad.count,
      days: nomad.days,
      share: Math.round((nomad.count / maxCount) * 100),
      barClass: accent.bar,
      countClass: accent.count,
      weeks,
      weekdayLabels: WEEKDAY_LABELS,
    };
  });

  return <NomadFilter rows={rows} stats={stats} selector={selector} />;
}
