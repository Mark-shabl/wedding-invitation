"use client";

import { motion } from "framer-motion";
import { SectionDivider } from "./section-divider";
import { Monogram } from "./monogram";

interface FooterProps {
  text: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
}

export function InvitationFooter({ text, groomName, brideName, weddingDate }: FooterProps) {
  const date = new Date(weddingDate);
  const dateStr = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="px-5 pb-20 pt-6 text-center"
    >
      <SectionDivider />
      <Monogram groom={groomName} bride={brideName} />
      <p className="font-serif text-xl sm:text-2xl text-[var(--text)] italic mt-6 leading-snug">{text}</p>
      <p className="mt-4 text-sm text-[var(--text-muted)] tracking-wide">{dateStr}</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="h-px w-12 bg-[var(--accent)]/25" />
        <span className="text-[var(--gold)] text-xs">♥</span>
        <span className="h-px w-12 bg-[var(--accent)]/25" />
      </div>
    </motion.footer>
  );
}
