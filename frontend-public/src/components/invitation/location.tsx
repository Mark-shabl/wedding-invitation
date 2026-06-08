"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "./section-card";
import { SectionTitle } from "./section-title";
import type { VenueItem } from "@/lib/types";

export function Location({ venues }: { venues: VenueItem[] }) {
  if (venues.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-2"
    >
      <SectionCard>
        <div className="px-5 py-8 sm:px-7 sm:py-10">
          <SectionTitle subtitle="Два адреса — регистрация и банкет">Место проведения</SectionTitle>

          <div className="max-w-md mx-auto space-y-10">
            {venues.map((venue, index) => (
              <div key={venue.id}>
                {index > 0 && (
                  <div className="flex items-center justify-center gap-3 mb-8 -mt-2">
                    <span className="h-px flex-1 bg-[var(--accent)]/15" />
                    <span className="text-[var(--gold)] text-xs">✦</span>
                    <span className="h-px flex-1 bg-[var(--accent)]/15" />
                  </div>
                )}

                <div className="text-center mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/10 mb-4">
                    <MapPin className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <p className="font-serif text-xl text-[var(--text)] leading-snug">{venue.title}</p>
                  {venue.address && (
                    <p className="text-[var(--text-muted)] mt-2 text-sm leading-relaxed">{venue.address}</p>
                  )}
                </div>

                {venue.map_embed_url && (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-[0_8px_24px_rgba(44,42,38,0.1)]">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs text-[var(--text-muted)] shadow-sm">
                      <Navigation className="w-3 h-3" />
                      На карте
                    </div>
                    <iframe
                      src={venue.map_embed_url}
                      title={venue.title}
                      className="w-full h-[220px] sm:h-[260px] border-0"
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                )}

                {venue.map_link_url && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={venue.map_link_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Как добраться
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </motion.section>
  );
}
