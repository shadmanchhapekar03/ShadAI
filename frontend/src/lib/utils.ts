import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toDate(date: Date | string | number): Date {
  return date instanceof Date ? date : new Date(date);
}

export function formatTime(date: Date | string): string {
  return toDate(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(date: Date | string): string {
  const d = toDate(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function groupLabel(date: Date | string): string {
  const d = toDate(date);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfDay - 86400000;
  const startOfWeek = startOfDay - 6 * 86400000;
  const t = d.getTime();
  if (t >= startOfDay) return "Today";
  if (t >= startOfYesterday) return "Yesterday";
  if (t >= startOfWeek) return "Last 7 Days";
  return "Older Chats";
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
