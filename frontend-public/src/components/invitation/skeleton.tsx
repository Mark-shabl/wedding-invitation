export function InvitationSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="px-5 pt-6">
        <div className="aspect-[4/5] max-w-sm mx-auto rounded-[1.5rem] bg-[var(--accent)]/10" />
      </div>
      <div className="px-5 pt-8 space-y-4">
        <div className="h-3 bg-[var(--gold)]/20 rounded w-24 mx-auto" />
        <div className="h-8 bg-[var(--accent)]/10 rounded w-3/4 mx-auto" />
        <div className="h-10 bg-[var(--accent)]/10 rounded-full w-2/3 mx-auto" />
        <div className="grid grid-cols-2 gap-3 mt-8 max-w-sm mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/50 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="mx-5 mt-8 h-48 rounded-3xl bg-white/40" />
      <div className="mx-5 mt-4 h-64 rounded-3xl bg-white/40" />
    </div>
  );
}
