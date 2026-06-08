"use client";

import { motion } from "framer-motion";
import { Heart, Users, UtensilsCrossed, Moon, Sparkles } from "lucide-react";
import type { ProgramItem } from "@/lib/types";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

const ICONS = [Heart, Users, UtensilsCrossed, Moon, Sparkles];

export function Program({ items }: { items: ProgramItem[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-2"
    >
      <SectionCard>
        <div className="px-5 py-8 sm:px-7 sm:py-10">
          <SectionTitle subtitle="Расписание нашего дня">Программа свадьбы</SectionTitle>

          <div className="relative max-w-md mx-auto space-y-0">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--gold)]/30 to-[var(--accent)]/40" />

            {items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-[var(--accent)]/30 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 pt-1.5 pb-4 border-b border-[var(--accent)]/10 last:border-0">
                    <p className="font-serif text-xl text-[var(--accent)] leading-none">{item.time}</p>
                    <p className="text-[var(--text)] mt-1.5 text-[15px] leading-snug">{item.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </motion.section>
  );
}
