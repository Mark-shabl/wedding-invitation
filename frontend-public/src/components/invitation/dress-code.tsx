"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

export function DressCodeSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-2"
    >
      <SectionCard variant="accent">
        <div className="px-4 py-8 sm:px-6 sm:py-10">
          <SectionTitle subtitle="Поддержите нашу цветовую гамму">Дресс-код</SectionTitle>

          {/* Color palette */}
          <div className="mb-6">
            <p className="text-center text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
              Основные цвета: розовый, жёлтый, светлый хаки, пудровый, голубой
            </p>
            <div className="relative rounded-2xl overflow-hidden border border-white/80 shadow-[0_8px_24px_rgba(44,42,38,0.08)]">
              <Image
                src="/dress-code/palette.png"
                alt="Палитра цветов для нарядов"
                width={800}
                height={1066}
                className="w-full h-auto"
                sizes="(max-width: 480px) 100vw, 480px"
              />
            </div>
          </div>

          {/* Lady & Men guide */}
          <div className="relative rounded-2xl overflow-hidden border border-white/80 shadow-[0_8px_24px_rgba(44,42,38,0.08)]">
            <Image
              src="/dress-code/guide.png"
              alt="Примеры нарядов для гостей"
              width={800}
              height={1200}
              className="w-full h-auto"
              sizes="(max-width: 480px) 100vw, 480px"
            />
          </div>

          <div className="mt-6 space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>
              <span className="font-serif text-[var(--text)] text-base">Lady — </span>
              платья и костюмы в нежных оттенках из палитры: атлас, шёлк, лёгкие ткани.
            </p>
            <p>
              <span className="font-serif text-[var(--text)] text-base">Men — </span>
              тёмный низ и светлая рубашка или поло.
            </p>
          </div>
        </div>
      </SectionCard>
    </motion.section>
  );
}
