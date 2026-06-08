"use client";

import { createContext, useContext } from "react";

export type AuthState = "checking" | "authed" | "guest";

export const AuthContext = createContext<{ state: AuthState }>({ state: "checking" });

export function useAuthState() {
  return useContext(AuthContext).state;
}
