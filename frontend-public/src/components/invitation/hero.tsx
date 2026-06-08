"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { WeddingSettings } from "@/lib/types";
import { photoUrl } from "@/lib/utils";
import { Countdown } from "./countdown";
import { Monogram } from "./monogram";

interface HeroProps {
  settings: WeddingSettings;
  guestName: string;
}

export function Hero({ settings, guestName }: HeroProps) {
  const date = new Date(settings.wedding_date);
  const dateStr = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative flex flex-col pb-4">
      {/* Photo / placeholder with arch frame */}
      <div className="relative px-5 pt-6">
        <div className="relative mx-auto max-w-sm">
          {/* decorative frame */}
          <div className="absolute -inset-2 rounded-[2rem] border border-[var(--gold)]/25 pointer-events-none" />
          <div className="absolute -inset-1 rounded-[1.75rem] border border-[var(--accent)]/15 pointer-events-none" />

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] shadow-[0_20px_60px_rgba(44,42,38,0.15)]">
            {settings.hero_photo_url ? (
              <Image
                src={photoUrl(settings.hero_photo_url)}
                alt={`${settings.groom_name} & ${settings.bride_name}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 480px) 100vw, 480px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/25 via-[var(--bg)] to-[var(--secondary)]/30 flex items-center justify-center">
                <Monogram groom={settings.groom_name} bride={settings.bride_name} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-black/10" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative px-5 pt-8 pb-4 text-center z-10"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] mb-2 font-medium">
          Мы женимся
        </p>
        <p className="text-sm text-[var(--text-muted)] mb-5">{dateStr}</p>

        <h1 className="font-serif text-[2.5rem] sm:text-5xl text-[var(--text)] leading-[1.15]">
          {settings.groom_name}
          <span className="block my-1">
            <span className="text-gradient-gold font-serif text-3xl sm:text-4xl">&</span>
          </span>
          {settings.bride_name}
        </h1>

        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-sm border border-[var(--accent)]/20 shadow-sm">
          <span className="text-[var(--accent)] text-sm">♥</span>
          <p className="font-serif text-base sm:text-lg text-[var(--secondary)] italic">
            Дорогой(ая), {guestName}!
          </p>
        </div>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)] mb-4">
            До торжества осталось
          </p>
          <Countdown targetDate={settings.wedding_date} />
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="mt-10 flex justify-center text-[var(--accent)]/50"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
