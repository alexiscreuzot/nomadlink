"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { MonthOption } from "@/lib/dates";

export function MonthSelect({
  options,
  selected,
}: {
  options: MonthOption[];
  selected: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selectedLabel =
    options.find((option) => option.slug === selected)?.label ?? "";

  return (
    <div className="group relative inline-flex items-center gap-1 rounded-lg focus-within:ring-2 focus-within:ring-sky/40">
      <span
        aria-hidden
        className="text-2xl font-bold capitalize text-ink transition group-hover:text-ink/70"
      >
        {selectedLabel}
      </span>

      {isPending ? (
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="size-4 animate-spin text-sky"
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
          className="size-4 text-ink-soft transition group-hover:text-sky"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

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
        className="absolute inset-0 size-full cursor-pointer opacity-0 outline-none disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
