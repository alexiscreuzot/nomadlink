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
  selector: ReactNode;
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
        {selector}
        <div className="flex justify-center sm:flex-1">{stats}</div>
        <div className="relative w-full sm:w-auto sm:flex-1">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft/60"
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
            className="w-full rounded-full bg-cream-deep/50 py-2 pl-9 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 hover:bg-cream-deep focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-sky/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-line bg-white p-8 text-center">
          <p className="font-semibold text-ink">Aucun nomade trouvé.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Aucun nom ne correspond à « {query.trim()} ».
          </p>
        </div>
      ) : (
        <ol className="flex flex-col gap-2">
          {filtered.map((row) => (
            <NomadRow key={row.name} {...row} />
          ))}
        </ol>
      )}
    </div>
  );
}
