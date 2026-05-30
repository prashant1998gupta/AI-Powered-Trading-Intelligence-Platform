"use client";

import { cn } from "@/lib/utils";
import {
  calculateBehaviorScore,
  detectRevengeTrading,
  detectOvertrading,
  getPerformanceByHour,
  getTradingHeatmap,
} from "@/lib/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Flame,
  Clock,
  TrendingDown,
  Shield,
  Zap,
} from "lucide-react";
import { Trade } from "@prisma/client";

// Get position size distribution
function getPositionSizeDistribution(trades: Trade[]) {
  if (trades.length === 0) return [];
  const sizes = trades.map((t) => t.quantity * t.entryPrice);
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  const bucketCount = 12;
  const bucketSize = (max - min) / bucketCount || 1;
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const low = min + i * bucketSize;
    const high = low + bucketSize;
    const count = sizes.filter((s) => s >= low && s < high).length;
    const wins = trades.filter(
      (t) => {
        const size = t.quantity * t.entryPrice;
        return size >= low && size < high && t.pnl > 0;
      }
    ).length;
    return {
      range: `₹${Math.round(low / 1000)}K`,
      count,
      winRate: count > 0 ? Math.round((wins / count) * 100) : 0,
    };
  });
  return buckets;
}

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 60;
  const progress = (score / 100) * circumference * 0.75;
  const color =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-[135deg]">
        <circle
          cx="70" cy="70" r="60"
          fill="none" stroke="#1e293b" strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
        />
        <circle
          cx="70" cy="70" r="60"
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold number-display" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-ag-text-muted">/ 100</span>
      </div>
    </div>
  );
}

const severityColors = {
  high: "border-ag-loss/30 bg-ag-loss-dim",
  medium: "border-ag-warning/30 bg-ag-warning-dim",
  low: "border-ag-profit/30 bg-ag-profit-dim",
};

const severityTextColors = {
  high: "text-ag-loss",
  medium: "text-ag-warning",
  low: "text-ag-profit",
};

interface AnalyticsClientProps {
  trades: Trade[];
}

export default function AnalyticsClient({ trades }: AnalyticsClientProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

  const behaviorScore = calculateBehaviorScore(trades);
  const revengeCount = detectRevengeTrading(trades);
  const overtradingDays = detectOvertrading(trades);
  const hourlyData = getPerformanceByHour(trades);
  const heatmapData = getTradingHeatmap(trades);
  const positionDist = getPositionSizeDistribution(trades);

  const patterns = [
    {
      title: "Revenge Trading",
      icon: Flame,
      count: revengeCount,
      severity: (revengeCount > 5 ? "high" : revengeCount > 2 ? "medium" : "low") as "high" | "medium" | "low",
      description:
        "Detected instances where you increased position size after consecutive losses on the same day.",
      impact: "Significant impact on drawdowns",
      suggestion: "Set a mandatory 30-minute break after 2 consecutive losses.",
    },
    {
      title: "Overtrading",
      icon: Zap,
      count: overtradingDays,
      severity: (overtradingDays > 10 ? "high" : overtradingDays > 5 ? "medium" : "low") as "high" | "medium" | "low",
      description:
        "Days where you exceeded 6 trades. Overtrading leads to higher brokerage costs and poor decision quality.",
      impact: "Excess brokerage & slippage",
      suggestion: "Limit yourself to a maximum of 5 trades per day.",
    },
    {
      title: "Late Entry",
      icon: Clock,
      count: Math.round(trades.filter((t) => parseInt(t.time) >= 14).length),
      severity: "medium" as const,
      description:
        "Trades entered after 2 PM show significantly lower win rates. Late entries often chase momentum.",
      impact: "Reduced overall win rate",
      suggestion: "Avoid new entries after 1 PM for 2 weeks as an experiment.",
    },
    {
      title: "Impulsive Exits",
      icon: TrendingDown,
      count: Math.round(trades.filter((t) => t.strategy === "Scalping" && t.pnl > 0 && t.pnl < 500).length),
      severity: "medium" as const,
      description:
        "You're cutting profitable trades too early. Many winning trades were closed with minimal profit.",
      impact: "Poor risk-reward ratio",
      suggestion: "Use trailing stop-losses instead of manual exits on winners.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ag-text-primary">
          Behavioral Analytics
        </h1>
        <p className="text-sm text-ag-text-secondary mt-1">
          Understand your trading psychology and behavioral patterns
        </p>
      </div>

      {/* Behavior Score + Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Score Card */}
        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-ag-primary" />
            <h3 className="text-sm font-semibold text-ag-text-primary">
              Behavior Score
            </h3>
          </div>
          <ScoreGauge score={behaviorScore} />
          <p className="text-xs text-ag-text-secondary mt-4">
            {behaviorScore >= 70
              ? "Good discipline — keep it up!"
              : behaviorScore >= 40
              ? "Room for improvement in trading discipline"
              : "Critical — behavioral issues are costing you money"}
          </p>
        </div>

        {/* Pattern Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <div
                key={pattern.title}
                className={cn(
                  "glass-card p-5 border-l-4 transition-all hover:translate-x-1",
                  severityColors[pattern.severity]
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", severityTextColors[pattern.severity])} />
                    <h4 className="text-sm font-semibold text-ag-text-primary">
                      {pattern.title}
                    </h4>
                  </div>
                  <span className={cn(
                    "text-2xl font-bold number-display",
                    severityTextColors[pattern.severity]
                  )}>
                    {pattern.count}
                  </span>
                </div>
                <p className="text-xs text-ag-text-secondary mb-2">
                  {pattern.description}
                </p>
                <p className={cn("text-xs font-semibold number-display mb-2", severityTextColors[pattern.severity])}>
                  {pattern.impact}
                </p>
                <div className="bg-ag-bg-primary/50 rounded-lg p-2 mt-2">
                  <p className="text-xs text-ag-accent">
                    💡 {pattern.suggestion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trading Heatmap */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
          Trading Activity Heatmap
        </h3>
        <p className="text-xs text-ag-text-secondary mb-4">
          Shows trade frequency by hour of day and day of week. Darker = more trades.
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-xs text-ag-text-muted" />
              {hours.map((h) => (
                <div key={h} className="text-xs text-ag-text-muted text-center">
                  {h}
                </div>
              ))}
            </div>
            {/* Rows */}
            {days.map((day) => (
              <div key={day} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-xs text-ag-text-muted flex items-center">
                  {day}
                </div>
                {hours.map((hour) => {
                  const cell = heatmapData.find(
                    (c) => c.day === day && c.hour === hour
                  );
                  const count = cell?.count || 0;
                  const pnl = cell?.pnl || 0;
                  const maxCount = Math.max(...heatmapData.map((c) => c.count));
                  const intensity = maxCount > 0 ? count / maxCount : 0;

                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={cn(
                        "aspect-[2/1] rounded flex items-center justify-center text-[10px] font-medium cursor-default transition-transform hover:scale-110 relative group",
                        count === 0
                          ? "bg-ag-bg-elevated/30"
                          : pnl >= 0
                          ? `bg-emerald-500`
                          : `bg-red-500`
                      )}
                      style={{
                        opacity: count === 0 ? 0.3 : 0.2 + intensity * 0.8,
                      }}
                    >
                      <span className="text-white/80">{count || ""}</span>
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap">
                        <div className="glass-card !bg-ag-bg-primary/95 px-2 py-1 text-[10px] border border-ag-border">
                          {count} trades · {pnl >= 0 ? "+" : ""}₹{Math.round(pnl).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Performance + Position Size Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Performance */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
            Performance by Hour
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} width={45} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content={({ active, payload }: any) =>
                    active && payload?.[0] ? (
                      <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
                        <p className="text-ag-text-muted text-xs">{payload[0].payload.hour}</p>
                        <p className="text-ag-text-primary font-bold">Win Rate: {payload[0].payload.winRate}%</p>
                        <p className="text-ag-text-muted text-xs">{payload[0].payload.trades} trades</p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.winRate >= 50 ? "#10b981" : "#ef4444"} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Position Size Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
            Position Size Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={35} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content={({ active, payload }: any) =>
                    active && payload?.[0] ? (
                      <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
                        <p className="text-ag-text-muted text-xs">{payload[0].payload.range}</p>
                        <p className="text-ag-text-primary">{payload[0].payload.count} trades</p>
                        <p className="text-ag-text-muted text-xs">Win Rate: {payload[0].payload.winRate}%</p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="count" fill="#3b82f6" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
