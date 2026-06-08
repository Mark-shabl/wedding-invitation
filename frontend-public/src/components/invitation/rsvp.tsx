"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmitRSVP } from "@/lib/api";
import type { RSVPData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

interface RSVPProps {
  token: string;
  existing?: RSVPData;
}

export function RSVPSection({ token, existing }: RSVPProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(existing ? existing.attending : null);
  const [guestsCount, setGuestsCount] = useState(existing?.guests_count ?? 1);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [success, setSuccess] = useState(!!existing);
  const mutation = useSubmitRSVP(token);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && !success),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [success]);

  const handleSubmit = async () => {
    if (attending === null) return;
    try {
      await mutation.mutateAsync({ attending, guests_count: guestsCount, comment });
      setSuccess(true);
    } catch {
      // error shown via mutation state
    }
  };

  if (success) {
    return (
      <section ref={sectionRef} className="py-2 px-0">
        <SectionCard variant="rsvp">
          <div className="px-6 py-10">
            <SuccessScreen attending={existing?.attending ?? attending ?? true} />
          </div>
        </SectionCard>
      </section>
    );
  }

  return (
    <>
      <motion.section
        ref={sectionRef}
        id="rsvp"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-2"
      >
        <SectionCard variant="rsvp">
          <div className="px-5 py-8 sm:px-7 sm:py-10">
            <SectionTitle subtitle="Подтвердите своё присутствие">Вы сможете прийти?</SectionTitle>
            <p className="text-center text-[var(--text-muted)] text-sm mb-8 max-w-xs mx-auto leading-relaxed -mt-4">
              Ответьте на пару вопросов, чтобы мы всё подготовили!
            </p>

            <div className="max-w-md mx-auto space-y-6">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={attending === true ? "chipActive" : "chip"}
                  className="flex-1"
                  onClick={() => setAttending(true)}
                >
                  ✓ Да, буду
                </Button>
                <Button
                  type="button"
                  variant={attending === false ? "chipActive" : "chip"}
                  className="flex-1"
                  onClick={() => setAttending(false)}
                >
                  К сожалению, нет
                </Button>
              </div>

              {attending && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="text-sm text-[var(--text-muted)] mb-2 block">Количество гостей</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                  />
                </motion.div>
              )}

              <div>
                <label className="text-sm text-[var(--text-muted)] mb-2 block">Комментарий (необязательно)</label>
                <Textarea
                  placeholder="Аллергии, пожелания..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {mutation.isError && (
                <p className="text-red-600 text-sm text-center">{mutation.error.message}</p>
              )}

              <Button
                size="lg"
                className="w-full shadow-[0_4px_20px_rgba(139,154,125,0.35)]"
                disabled={attending === null || mutation.isPending}
                onClick={handleSubmit}
              >
                {mutation.isPending ? "Отправляем..." : "Подтвердить участие"}
              </Button>
            </div>
          </div>
        </SectionCard>
      </motion.section>

      <AnimatePresence>
        {showSticky && attending !== null && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
              "bg-[var(--bg)]/95 backdrop-blur-xl border-t border-[var(--accent)]/20 shadow-[0_-8px_32px_rgba(44,42,38,0.08)]"
            )}
          >
            <div className="max-w-md mx-auto">
              <Button size="lg" className="w-full" disabled={mutation.isPending} onClick={handleSubmit}>
                Подтвердить участие
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SuccessScreen({ attending }: { attending: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--secondary)]/20 border border-[var(--accent)]/20 flex items-center justify-center mb-6"
      >
        <span className="text-4xl">{attending ? "💐" : "💌"}</span>
      </motion.div>
      <h2 className="font-serif text-2xl text-[var(--text)] mb-3">Спасибо!</h2>
      <p className="text-[var(--text-muted)] leading-relaxed">
        {attending
          ? "Мы получили ваше подтверждение и очень ждём встречи!"
          : "Жаль, что не получится. Будем скучать!"}
      </p>
    </motion.div>
  );
}
