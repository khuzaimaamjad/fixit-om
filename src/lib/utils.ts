import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Omani Rial — 3-decimal baisa convention (OMR 12.500). */
export function omr(value: number): string {
  if (!Number.isFinite(value)) return "OMR 0.000";
  return `OMR ${value.toFixed(3)}`;
}

/** Short OMR (2dp) for tight chips and badges. */
export function omrShort(value: number): string {
  if (!Number.isFinite(value)) return "0.00";
  return value.toFixed(2);
}
