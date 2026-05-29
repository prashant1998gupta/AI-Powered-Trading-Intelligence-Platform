import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as INR currency */
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 10000000) {
    return `${sign}₹${(absValue / 10000000).toFixed(2)}Cr`;
  }
  if (absValue >= 100000) {
    return `${sign}₹${(absValue / 100000).toFixed(2)}L`;
  }
  if (absValue >= 1000) {
    return `${sign}₹${absValue.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  }
  return `${sign}₹${absValue.toFixed(2)}`;
}

/** Format a number as INR with full precision */
export function formatCurrencyFull(value: number): string {
  const sign = value < 0 ? "-" : value > 0 ? "+" : "";
  return `${sign}₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format as percentage */
export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/** Format compact numbers */
export function formatCompact(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

/** Format date as dd MMM yyyy */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format date as dd MMM */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

/** Format time as HH:mm */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Get day of week name */
export function getDayName(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}

/** Generate a random number between min and max */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Get profit/loss color class */
export function pnlColor(value: number): string {
  if (value > 0) return "text-ag-profit";
  if (value < 0) return "text-ag-loss";
  return "text-ag-text-secondary";
}

/** Get profit/loss background class */
export function pnlBg(value: number): string {
  if (value > 0) return "bg-ag-profit-dim";
  if (value < 0) return "bg-ag-loss-dim";
  return "bg-ag-bg-elevated";
}
