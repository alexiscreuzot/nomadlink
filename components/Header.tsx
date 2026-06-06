import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <Image
        src="/images/bunny.png"
        alt="Happy Hours"
        width={84}
        height={170}
        priority
        className="h-auto w-[72px] sm:w-[84px]"
      />
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-ink-soft">
          Happy Hours
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Réservations Nomades
        </h1>
      </div>
    </header>
  );
}
