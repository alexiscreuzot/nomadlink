"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { MonthOption } from "@/lib/dates";

export function MonthSelector({
  options,
  selected,
}: {
  options: MonthOption[];
  selected: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="group relative inline-flex items-center">
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="pointer-events-none absolute left-4 size-4 text-buttercup"
      >
        <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
        <path d="M3 8h14" />
        <path d="M7 2.5v3M13 2.5v3" strokeLinecap="round" />
      </svg>

      <select
        value={selected}
        disabled={isPending}
        onChange={(event) => {
          const slug = event.target.value;
          startTransition(() => {
            router.push(`/?m=${slug}`);
          });
        }}
        aria-label="Choisir le mois"
        className="cursor-pointer appearance-none rounded-full border-2 border-ink/15 bg-cream-deep/40 py-2.5 pl-11 pr-11 text-sm font-semibold capitalize text-ink outline-none transition hover:border-sky focus-visible:border-sky focus-visible:ring-4 focus-visible:ring-sky/30 disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
      </select>

      {isPending ? (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-4 size-4 animate-spin text-sky"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <circle cx="10" cy="10" r="7" className="opacity-25" />
          <path d="M10 3a7 7 0 0 1 7 7" strokeLinecap="round" />
        </svg>
      ) : (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-4 size-4 text-ink-soft transition group-hover:text-sky"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
