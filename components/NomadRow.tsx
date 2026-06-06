"use client";

import { useId, useState } from "react";
import {
  type Amount,
  type DayPricing,
  formatEUR,
  priceForDays,
} from "@/lib/pricing";

function PriceRow({ label, amount }: { label: string; amount: Amount }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-base font-bold tabular-nums text-ink">
          {formatEUR(amount.ht)}
          <span className="ml-0.5 text-[10px] font-medium text-ink-soft">HT</span>
        </span>
        <span className="text-xs tabular-nums text-ink-soft">
          {formatEUR(amount.ttc)} TTC
        </span>
      </span>
    </div>
  );
}

function BillingPanel({ price }: { price: DayPricing }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2.5 rounded-xl bg-cream px-4 py-3">
      <PriceRow label="Adhérent" amount={price.member} />
      <div className="h-px bg-ink/10" />
      <PriceRow label="Non-adhérent" amount={price.nonMember} />
    </div>
  );
}

function MiniCalendar({
  weeks,
  weekdayLabels,
  days,
  barClass,
}: {
  weeks: number[][];
  weekdayLabels: string[];
  days: number[];
  barClass: string;
}) {
  const used = new Set(days);
  return (
    <div className="grid w-[252px] grid-cols-7 gap-1 text-center">
      {weekdayLabels.map((label, index) => (
        <span
          key={`label-${index}`}
          className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft/70"
        >
          {label}
        </span>
      ))}
      {weeks.flat().map((day, index) =>
        day === 0 ? (
          <span key={`cell-${index}`} aria-hidden />
        ) : (
          <span
            key={`cell-${index}`}
            className={`flex h-7 items-center justify-center rounded-md text-xs tabular-nums ${
              used.has(day)
                ? `${barClass} font-semibold text-white`
                : "text-ink-soft/50"
            }`}
          >
            {day}
          </span>
        ),
      )}
    </div>
  );
}

export type NomadRowProps = {
  rank: number;
  name: string;
  count: number;
  days: number[];
  share: number;
  barClass: string;
  countClass: string;
  weeks: number[][];
  weekdayLabels: string[];
};

export function NomadRow({
  rank,
  name,
  count,
  days,
  share,
  barClass,
  countClass,
  weeks,
  weekdayLabels,
}: NomadRowProps) {
  const [open, setOpen] = useState(false);
  const datesId = useId();
  const price = priceForDays(count);

  return (
    <li
      className="rise rounded-2xl bg-white px-4 py-3.5 shadow-soft transition-shadow hover:shadow-lift sm:px-5"
      style={{ animationDelay: `${Math.min((rank - 1) * 40, 320)}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={datesId}
        className="flex w-full cursor-pointer items-center gap-3 text-left"
      >
        <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-ink-soft">
          {rank}
        </span>
        <span className="flex-1 truncate text-lg font-semibold text-ink sm:text-xl">
          {name}
        </span>
        <span className="flex shrink-0 items-baseline justify-end gap-1.5">
          <span className={`text-2xl font-bold tabular-nums ${countClass}`}>
            {count}
          </span>
          <span className="w-9 text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
            {count > 1 ? "jours" : "jour"}
          </span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`size-4 shrink-0 text-ink-soft transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mt-2.5 ml-8 h-1.5 overflow-hidden rounded-full bg-cream-deep">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${share}%` }} />
      </div>

      <div
        id={datesId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 ml-8 flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-6">
            <MiniCalendar
              weeks={weeks}
              weekdayLabels={weekdayLabels}
              days={days}
              barClass={barClass}
            />
            <BillingPanel price={price} />
          </div>
        </div>
      </div>
    </li>
  );
}
