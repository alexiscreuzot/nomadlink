"use client";

import { useId, useState } from "react";
import {
  type Amount,
  type DayPricing,
  formatEUR,
  priceForDays,
} from "@/lib/pricing";

function PriceTier({
  label,
  amount,
  isPrimary,
}: {
  label: string;
  amount: Amount;
  isPrimary?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col gap-1 border-l-2 pl-3 ${
        isPrimary ? "border-ink" : "border-ink/15"
      }`}
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-wide ${
          isPrimary ? "text-ink" : "text-ink-soft/70"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-bold leading-none tabular-nums ${
          isPrimary
            ? "text-[32px] text-ink sm:text-[34px]"
            : "text-2xl text-ink-soft/60 sm:text-[26px]"
        }`}
      >
        {formatEUR(amount.ttc)}
      </span>
      <span
        className={`text-[11px] font-medium tabular-nums ${
          isPrimary ? "text-ink-soft" : "text-ink-soft/50"
        }`}
      >
        {formatEUR(amount.ht)} HT
      </span>
    </div>
  );
}

function BillingPanel({ days, price }: { days: number; price: DayPricing }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-baseline justify-between border-b border-ink/10 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          Prix à payer
        </span>
        <span className="text-[11px] font-medium tabular-nums text-ink-soft/70">
          {days} {days > 1 ? "jours" : "jour"} · TTC
        </span>
      </div>
      <div className="flex gap-5">
        <PriceTier label="Adhérent" amount={price.member} isPrimary />
        <PriceTier label="Non-adhérent" amount={price.nonMember} />
      </div>
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
    <div className="mx-auto grid w-full max-w-[280px] grid-cols-7 gap-1 text-center sm:mx-0 sm:w-[252px]">
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
      className="rise relative rounded-card border border-line bg-white px-4 py-3.5 transition-colors hover:border-ink/25 sm:px-5"
      style={{ animationDelay: `${Math.min((rank - 1) * 40, 320)}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={datesId}
        className="absolute inset-0 z-10 cursor-pointer rounded-card"
      >
        <span className="sr-only">{name}</span>
      </button>

      <div className="pointer-events-none flex items-center gap-3">
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
      </div>

      <div className="pointer-events-none mt-2.5 ml-8 h-1.5 overflow-hidden rounded-full bg-cream-deep">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${share}%` }} />
      </div>

      <div
        id={datesId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pointer-events-none mt-4 flex flex-col gap-4 sm:ml-8 sm:flex-row sm:items-stretch sm:gap-6">
            <MiniCalendar
              weeks={weeks}
              weekdayLabels={weekdayLabels}
              days={days}
              barClass={barClass}
            />
            <BillingPanel days={count} price={price} />
          </div>
        </div>
      </div>
    </li>
  );
}
