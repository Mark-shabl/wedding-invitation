"use client";

import { motion } from "framer-motion";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

interface WelcomeProps {
  text: string;
}

export function Welcome({ text }: WelcomeProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="py-2"
    >
      <SectionCard variant="accent">
        <div className="px-6 py-8 sm:px-8 sm:py-10 relative">
          <span className="absolute top-4 left-6 font-serif text-6xl text-[var(--accent)]/15 leading-none select-none">&ldquo;</span>
          <SectionTitle subtitle="С радостью приглашаем вас">Дорогие гости</SectionTitle>
          <p className="text-center text-[var(--text-muted)] leading-[1.8] text-[15px] max-w-sm mx-auto whitespace-pre-line relative z-10">
            {text}
          </p>
          <span className="absolute bottom-4 right-6 font-serif text-6xl text-[var(--accent)]/15 leading-none select-none">&rdquo;</span>
        </div>
      </SectionCard>
    </motion.section>
  );
}
