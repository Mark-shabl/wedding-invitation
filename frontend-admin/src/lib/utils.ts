import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Пустая строка = относительные URL через Next.js rewrite proxy */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || "http://localhost:3000";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

export function photoUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
