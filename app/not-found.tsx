import Link from "next/link";
import { RabbitLogo } from "@/components/RabbitLogo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="flex size-20 items-center justify-center rounded-full border-2 border-salmon/50 bg-white text-ink">
        <RabbitLogo className="size-12" />
      </span>
      <div>
        <h1 className="text-3xl font-bold text-ink">Oups, page introuvable</h1>
        <p className="mt-2 text-ink-soft">
          Le lapin a creusé un peu trop loin. Cette page n&apos;existe pas.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-ink-soft"
      >
        Retour aux réservations
      </Link>
    </div>
  );
}
