const VAT_RATE = 0.2;

/** Nomade daily rates (HT) from happyh0urs.com. */
export const DAILY_RATE_HT = {
  member: 18,
  nonMember: 24,
} as const;

export type Amount = {
  ht: number;
  ttc: number;
};

export type DayPricing = {
  member: Amount;
  nonMember: Amount;
};

function amount(rate: number, days: number): Amount {
  const ht = rate * days;
  return { ht, ttc: ht * (1 + VAT_RATE) };
}

export function priceForDays(days: number): DayPricing {
  return {
    member: amount(DAILY_RATE_HT.member, days),
    nonMember: amount(DAILY_RATE_HT.nonMember, days),
  };
}

const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEUR(value: number): string {
  return eur.format(value);
}
