export function Monogram({ groom, bride }: { groom: string; bride: string }) {
  const g = groom.charAt(0).toUpperCase();
  const b = bride.charAt(0).toUpperCase();
  return (
    <div className="relative w-28 h-28 mx-auto">
      <div className="absolute inset-0 rounded-full border border-[var(--gold)]/40 rotate-45 scale-110" />
      <div className="absolute inset-0 rounded-full border border-[var(--accent)]/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-4xl text-[var(--text)] tracking-widest">
          {g}<span className="text-[var(--accent)] mx-1 text-2xl">&</span>{b}
        </span>
      </div>
    </div>
  );
}
