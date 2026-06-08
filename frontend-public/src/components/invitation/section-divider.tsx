export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-6 px-5">
      <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-[var(--gold)]/40" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[var(--gold)] opacity-70 shrink-0">
        <path d="M10 2L11.5 8.5H18L12.75 12.5L14.5 19L10 15L5.5 19L7.25 12.5L2 8.5H8.5L10 2Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </svg>
      <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent via-[var(--accent)]/30 to-[var(--gold)]/40" />
    </div>
  );
}
