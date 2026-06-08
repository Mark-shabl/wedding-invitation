"use client";

import { useInvitation } from "@/lib/api";
import { DEFAULT_VENUES } from "@/lib/venues";
import { Hero } from "./hero";
import { Welcome } from "./welcome";
import { Program } from "./program";
import { Location } from "./location";
import { FAQSection } from "./faq";
import { DressCodeSection } from "./dress-code";
import { RSVPSection } from "./rsvp";
import { InvitationFooter } from "./footer";
import { SectionDivider } from "./section-divider";
import { InvitationSkeleton } from "./skeleton";
import { DecorativeBg } from "./decorative-bg";

export function InvitationPage({ token }: { token: string }) {
  const { data, isLoading, error } = useInvitation(token);

  if (isLoading) return <InvitationSkeleton />;

  if (error?.message === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <p className="font-serif text-3xl text-[var(--text)] mb-4">Приглашение не найдено</p>
          <p className="text-[var(--text-muted)]">Проверьте ссылку или свяжитесь с организаторами.</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <p className="text-[var(--text-muted)]">Не удалось загрузить приглашение</p>
      </div>
    );
  }

  const { settings } = data;

  return (
    <div
      className="min-h-screen relative pb-4"
      style={
        {
          "--accent": settings.accent_color || "#8B9A7D",
          "--secondary": settings.secondary_color || "#C4A4A4",
        } as React.CSSProperties
      }
    >
      <DecorativeBg />
      <Hero settings={settings} guestName={data.guest_name} />
      <SectionDivider />
      <Welcome text={settings.welcome_text} />
      <SectionDivider />
      <Program items={data.program} />
      <SectionDivider />
      <Location venues={data.venues?.length ? data.venues : DEFAULT_VENUES} />
      <SectionDivider />
      <DressCodeSection />
      <SectionDivider />
      <FAQSection items={data.faq} />
      <SectionDivider />
      <RSVPSection token={token} existing={data.rsvp} />
      <InvitationFooter
        text={settings.footer_text}
        groomName={settings.groom_name}
        brideName={settings.bride_name}
        weddingDate={settings.wedding_date}
      />
    </div>
  );
}
