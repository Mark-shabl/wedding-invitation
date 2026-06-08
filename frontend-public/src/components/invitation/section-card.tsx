import { cn } from "@/lib/utils";

export function SectionCard({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "rsvp";
}) {
  return (
    <div
      className={cn(
        "mx-4 sm:mx-5 rounded-3xl overflow-hidden",
        variant === "default" && "bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(44,42,38,0.06)]",
        variant === "accent" && "bg-gradient-to-br from-white/70 to-[var(--accent)]/5 backdrop-blur-md border border-[var(--accent)]/20 shadow-[0_8px_32px_rgba(44,42,38,0.08)]",
        variant === "rsvp" && "bg-gradient-to-br from-white/80 via-white/60 to-[var(--secondary)]/10 backdrop-blur-md border-2 border-[var(--accent)]/25 shadow-[0_12px_40px_rgba(44,42,38,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
