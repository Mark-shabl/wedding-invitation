"use client";

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { authHeaders, clearToken, setToken } from "./auth";
import { useAuthState } from "./auth-context";
import type {
  DashboardStats,
  FAQItem,
  Guest,
  LoginResponse,
  ProgramItem,
  RSVPDTO,
  WeddingSettings,
} from "./types";
import { apiUrl } from "./utils";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function useAuthedQuery<T>(key: unknown[], path: string, options?: Partial<UseQueryOptions<T>>) {
  const authState = useAuthState();
  return useQuery({
    queryKey: key,
    queryFn: () => apiFetch<T>(path),
    enabled: authState === "authed",
    retry: 1,
    ...options,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch(apiUrl("/api/v1/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Неверный логин или пароль");
      const json: LoginResponse = await res.json();
      setToken(json.access_token);
      return json;
    },
  });
}

export function useDashboard() {
  return useAuthedQuery<DashboardStats>(["dashboard"], "/api/v1/admin/dashboard");
}

export function useSettings() {
  return useAuthedQuery<WeddingSettings>(["settings"], "/api/v1/admin/settings");
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WeddingSettings) =>
      apiFetch<WeddingSettings>("/api/v1/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useProgram() {
  return useAuthedQuery<ProgramItem[]>(["program"], "/api/v1/admin/program");
}

export function useCreateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProgramItem, "id">) =>
      apiFetch<ProgramItem>("/api/v1/admin/program", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["program"] }),
  });
}

export function useDeleteProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/api/v1/admin/program/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["program"] }),
  });
}

export function useFAQ() {
  return useAuthedQuery<FAQItem[]>(["faq"], "/api/v1/admin/faq");
}

export function useCreateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FAQItem, "id">) =>
      apiFetch<FAQItem>("/api/v1/admin/faq", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq"] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/api/v1/admin/faq/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq"] }),
  });
}

export function useGuests() {
  return useAuthedQuery<Guest[]>(["guests"], "/api/v1/admin/guests");
}

export function useCreateGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      apiFetch<Guest>("/api/v1/admin/guests", { method: "POST", body: JSON.stringify({ name }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guests"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteGuest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiFetch<void>(`/api/v1/admin/guests/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["guests"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRSVPs(filter?: string) {
  const authState = useAuthState();
  const q = filter ? `?filter=${filter}` : "";
  return useQuery({
    queryKey: ["rsvps", filter],
    queryFn: () => apiFetch<RSVPDTO[]>(`/api/v1/admin/rsvps${q}`),
    enabled: authState === "authed",
    retry: 1,
  });
}

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(apiUrl("/api/v1/admin/upload"), {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.url;
}
