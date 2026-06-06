export function RabbitLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Happy Hours"
      fill="currentColor"
    >
      <ellipse cx="23" cy="19" rx="6.5" ry="17" transform="rotate(-14 23 19)" />
      <ellipse cx="41" cy="19" rx="6.5" ry="17" transform="rotate(14 41 19)" />
      <circle cx="32" cy="44" r="16" />
      <circle cx="26" cy="42" r="2.4" fill="var(--color-cream)" />
      <circle cx="38" cy="42" r="2.4" fill="var(--color-cream)" />
      <circle cx="32" cy="48" r="2" fill="var(--color-salmon)" />
    </svg>
  );
}
