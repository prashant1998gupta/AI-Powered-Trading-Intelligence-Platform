"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  color?: "profit" | "loss" | "primary" | "accent" | "warning";
  children?: ReactNode;
}

const colorMap = {
  profit: {
    icon: "bg-ag-profit-dim text-ag-profit",
    value: "text-ag-profit",
    glow: "hover:shadow-glow-green",
  },
  loss: {
    icon: "bg-ag-loss-dim text-ag-loss",
    value: "text-ag-loss",
    glow: "hover:shadow-glow-red",
  },
  primary: {
    icon: "bg-ag-glow text-ag-primary",
    value: "text-ag-primary",
    glow: "hover:shadow-glow-blue",
  },
  accent: {
    icon: "bg-ag-glow-accent text-ag-accent",
    value: "text-ag-accent",
    glow: "hover:shadow-glow-cyan",
  },
  warning: {
    icon: "bg-ag-warning-dim text-ag-warning",
    value: "text-ag-warning",
    glow: "",
  },
};

export default function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  color = "primary",
  children,
}: KPICardProps) {
  const colors = colorMap[color];
  const TrendIcon =
    trend !== undefined
      ? trend > 0
        ? TrendingUp
        : trend < 0
        ? TrendingDown
        : Minus
      : null;
  const trendColor =
    trend !== undefined
      ? trend > 0
        ? "text-ag-profit"
        : trend < 0
        ? "text-ag-loss"
        : "text-ag-text-muted"
      : "";

  return (
    <div
      className={cn(
        "glass-card p-5 transition-all duration-300 group",
        colors.glow
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-ag-text-muted mb-1">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold number-display animate-count-up",
              colors.value
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            colors.icon
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend !== undefined && TrendIcon && (
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1", trendColor)}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span className="text-sm font-medium number-display">
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
          {trendLabel && (
            <span className="text-xs text-ag-text-muted">{trendLabel}</span>
          )}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
