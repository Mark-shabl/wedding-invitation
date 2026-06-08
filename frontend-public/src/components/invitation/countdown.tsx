"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white/65 backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(44,42,38,0.07)] py-4 px-2 min-h-[84px] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-3xl sm:text-4xl text-[var(--text)] leading-none tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-2">{label}</span>
    </div>
  );
}

export function Countdown({ targetDate }: CountdownProps) {
  const target = useMemo(() => new Date(targetDate), [targetDate]);
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [targetDate, target]);

  const units = [
    { value: time.days, label: "дней" },
    { value: time.hours, label: "часов" },
    { value: time.minutes, label: "минут" },
    { value: time.seconds, label: "секунд" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
      {units.map((u) => (
        <Unit key={u.label} value={u.value} label={u.label} />
      ))}
    </div>
  );
}
