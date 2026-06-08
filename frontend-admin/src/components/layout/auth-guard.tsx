"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { AuthContext, type AuthState } from "@/lib/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>("checking");

  useEffect(() => {
    if (getToken()) {
      setState("authed");
    } else {
      setState("guest");
      router.replace("/login");
    }
  }, [router]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Проверка доступа...</p>
      </div>
    );
  }

  if (state === "guest") return null;

  return <AuthContext.Provider value={{ state }}>{children}</AuthContext.Provider>;
}
