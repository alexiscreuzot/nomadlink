"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function DayPicker({ label, value }: { label: string; value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <label
      className={`relative inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-deep/40 py-1 pl-3.5 pr-2.5 text-sm font-semibold text-ink transition hover:border-ink/25 hover:bg-cream-deep/70 ${
        isPending ? "pointer-events-none opacity-60" : "cursor-pointer"
      }`}
    >
      {label}
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="size-3.5 text-ink-soft"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="4.5" width="14" height="13" rx="2.5" />
        <path d="M3 8h14M7 3v3M13 3v3" strokeLinecap="round" />
      </svg>
      <input
        type="date"
        value={value}
        disabled={isPending}
        aria-label="Choisir la date"
        onChange={(event) => {
          if (!event.target.value) return;
          const next = new URLSearchParams(searchParams.toString());
          next.set("d", event.target.value);
          startTransition(() => {
            router.push(`/?${next.toString()}`);
          });
        }}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </label>
  );
}
