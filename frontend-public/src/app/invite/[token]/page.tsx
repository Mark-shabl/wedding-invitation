import { InvitationPage } from "@/components/invitation/invitation-page";

export default function InvitePage({ params }: { params: { token: string } }) {
  return (
    <main className="max-w-lg mx-auto grain min-h-screen relative overflow-x-hidden bg-[var(--bg)]">
      <InvitationPage token={params.token} />
    </main>
  );
}
