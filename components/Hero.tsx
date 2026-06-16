import Image from "next/image";
import { DayPresence } from "@/components/DayPresence";

export function Hero({ date }: { date: Date }) {
  return (
    <header className="rise relative w-full">
      <div className="flex items-center gap-5 sm:gap-7">
        <Image
          src="/images/bunny.png"
          alt="Happy Hours"
          width={104}
          height={210}
          priority
          className="h-auto w-[84px] shrink-0 self-start sm:w-[104px]"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-ink-soft">
            Happy Hours
          </p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Réservations Nomades
          </h1>

          <DayPresence date={date} />
        </div>
      </div>
    </header>
  );
}
