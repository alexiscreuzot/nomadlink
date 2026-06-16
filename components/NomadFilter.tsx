"use client";

import { useMemo, useState, type ReactNode } from "react";
import { NomadRow, type NomadRowProps } from "./NomadRow";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function NomadFilter({
  rows,
  stats,
  selector,
}: {
  rows: NomadRowProps[];
  stats?: ReactNode;
  selector?: ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return rows;
    return rows.filter((row) => normalize(row.name).includes(needle));
  }, [query, rows]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {stats}
        <div className="relative flex-1">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrer par nom…"
            aria-label="Filtrer par nom"
            className="w-full rounded-full border-2 border-ink/20 bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-ink outline-none transition placeholder:text-ink-soft/70 hover:border-sky focus-visible:border-sky focus-visible:ring-4 focus-visible:ring-sky/30"
          />
        </div>
        {selector}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card bg-white p-8 text-center shadow-soft">
          <p className="font-semibold text-ink">Aucun nomade trouvé.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Aucun nom ne correspond à « {query.trim()} ».
          </p>
        </div>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {filtered.map((row) => (
            <NomadRow key={row.name} {...row} />
          ))}
        </ol>
      )}
    </div>
  );
}
