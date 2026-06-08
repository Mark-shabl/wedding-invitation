import { cn } from "@/lib/utils";

export function SectionTitle({
  children,
  subtitle,
  className,
}: {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center mb-8", className)}>
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]/60" />
        <span className="text-[var(--gold)] text-xs">✦</span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]/60" />
      </div>
      <h2 className="font-serif text-2xl sm:text-[1.75rem] text-[var(--text)] leading-snug">{children}</h2>
      {subtitle && (
        <p className="mt-2 text-sm text-[var(--text-muted)] tracking-wide">{subtitle}</p>
      )}
    </div>
  );
}
