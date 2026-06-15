function Stat({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-baseline gap-2 px-4 py-1.5">
      <span className={`text-3xl font-bold tabular-nums ${accent}`}>{value}</span>
      <span className="text-sm font-medium uppercase tracking-wide text-ink-soft">
        {label}
      </span>
    </div>
  );
}

export function StatsBanner({
  totalReservations,
  nomadCount,
}: {
  totalReservations: number;
  nomadCount: number;
}) {
  return (
    <div className="inline-flex items-center justify-center divide-x divide-ink/10 self-center rounded-full bg-white px-2 py-1.5 shadow-soft sm:self-auto">
      <Stat value={totalReservations} label="Réservations" accent="text-buttercup" />
      <Stat value={nomadCount} label="Nomades" accent="text-sky" />
    </div>
  );
}
