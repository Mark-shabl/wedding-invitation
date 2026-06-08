"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Invitation, SubmitRSVPRequest } from "./types";
import { apiUrl } from "./utils";

async function fetchInvitation(token: string): Promise<Invitation> {
  const res = await fetch(apiUrl(`/api/v1/invite/${token}`));
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load invitation");
  }
  return res.json();
}

async function submitRSVP(token: string, data: SubmitRSVPRequest) {
  const res = await fetch(apiUrl(`/api/v1/invite/${token}/rsvp`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit RSVP");
  }
  return res.json();
}

export function useInvitation(token: string) {
  return useQuery({
    queryKey: ["invitation", token],
    queryFn: () => fetchInvitation(token),
    retry: false,
  });
}

export function useSubmitRSVP(token: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitRSVPRequest) => submitRSVP(token, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitation", token] }),
  });
}
