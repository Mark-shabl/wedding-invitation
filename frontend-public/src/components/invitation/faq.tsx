"use client";

import { motion } from "framer-motion";
import type { FAQItem } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";

export function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-2"
    >
      <SectionCard>
        <div className="px-5 py-8 sm:px-7 sm:py-10">
          <SectionTitle subtitle="Всё, что нужно знать">Отвечаем на ваши вопросы</SectionTitle>

          <div className="max-w-md mx-auto">
            <Accordion type="single" collapsible defaultValue={items[0] ? `item-${items[0].id}` : undefined}>
              {items.map((item) => (
                <AccordionItem key={item.id} value={`item-${item.id}`}>
                  <AccordionTrigger className="font-serif text-base text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SectionCard>
    </motion.section>
  );
}
