"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

export function DayPicker({ label, value }: { label: string; value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
    }
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      disabled={isPending}
      className="relative inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream/70 py-1 pl-3.5 pr-2.5 text-sm font-semibold text-ink transition hover:border-sky/50 disabled:opacity-60"
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
        ref={inputRef}
        type="date"
        value={value}
        disabled={isPending}
        aria-label="Choisir la date"
        tabIndex={-1}
        onChange={(event) => {
          if (!event.target.value) return;
          const next = new URLSearchParams(searchParams.toString());
          next.set("d", event.target.value);
          startTransition(() => {
            router.push(`/?${next.toString()}`);
          });
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0 w-full opacity-0"
      />
    </button>
  );
}
