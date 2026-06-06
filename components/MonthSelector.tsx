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
    <label className="relative inline-flex items-center">
      <span className="sr-only">Choisir le mois</span>
      <select
        value={selected}
        disabled={isPending}
        onChange={(event) => {
          const slug = event.target.value;
          startTransition(() => {
            router.push(`/?m=${slug}`);
          });
        }}
        className="cursor-pointer appearance-none rounded-full border-2 border-ink/10 bg-white py-2.5 pl-5 pr-11 text-sm font-semibold text-ink shadow-soft outline-none transition hover:border-sky focus-visible:border-sky focus-visible:ring-4 focus-visible:ring-sky/30 disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 size-4 text-ink-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}
