"use client";

export function DecorativeBg() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 max-w-lg mx-auto">
      <div
        className="absolute -top-24 -right-16 w-64 h-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -left-20 w-56 h-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 -right-10 w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
      />
      {/* botanical corners */}
      <svg className="absolute top-8 left-3 w-16 h-16 text-[var(--accent)] opacity-15" viewBox="0 0 64 64" fill="none">
        <path d="M8 56C8 56 12 20 32 8C52 20 56 56 56 56" stroke="currentColor" strokeWidth="1" />
        <path d="M32 8V24M24 16L32 24L40 16" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <svg className="absolute bottom-24 right-3 w-16 h-16 text-[var(--secondary)] opacity-15 rotate-180" viewBox="0 0 64 64" fill="none">
        <path d="M8 56C8 56 12 20 32 8C52 20 56 56 56 56" stroke="currentColor" strokeWidth="1" />
        <path d="M32 8V24M24 16L32 24L40 16" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
