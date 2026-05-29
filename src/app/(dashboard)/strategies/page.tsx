"use client";

import { cn, formatCurrency } from "@/lib/utils";
import {
  getPerformanceByStrategy,
  getPerformanceBySector,
  getPerformanceByInstrument,
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
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Target, Award, BarChart3 } from "lucide-react";

const strategyData = getPerformanceByStrategy();
const sectorData = getPerformanceBySector();
const instrumentData = getPerformanceByInstrument();

const SECTOR_COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
];

const radarData = strategyData.map((s) => ({
  strategy: s.strategy,
  winRate: s.winRate,
  profitFactor: Math.min(s.profitFactor * 40, 100),
  trades: Math.min(s.trades, 100),
}));

export default function StrategiesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ag-text-primary">
          Strategy Analytics
        </h1>
        <p className="text-sm text-ag-text-secondary mt-1">
          Compare and optimize your trading strategies
        </p>
      </div>

      {/* Strategy Comparison Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-ag-border">
          <h3 className="text-sm font-semibold text-ag-text-primary flex items-center gap-2">
            <Target className="w-4 h-4 text-ag-primary" />
            Strategy Comparison
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ag-text-muted text-xs border-b border-ag-border bg-ag-bg-elevated/30">
              <th className="text-left py-3 px-5 font-medium">Strategy</th>
              <th className="text-right py-3 px-5 font-medium">Trades</th>
              <th className="text-right py-3 px-5 font-medium">Win Rate</th>
              <th className="text-right py-3 px-5 font-medium">Profit Factor</th>
              <th className="text-right py-3 px-5 font-medium">Net P&L</th>
              <th className="text-center py-3 px-5 font-medium">Performance</th>
            </tr>
          </thead>
          <tbody>
            {strategyData.map((s) => {
              const maxPnl = Math.max(...strategyData.map((s) => Math.abs(s.pnl)));
              const barWidth = Math.abs(s.pnl) / maxPnl * 100;
              return (
                <tr key={s.strategy} className="border-b border-ag-border/30 hover:bg-ag-bg-elevated/20 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        s.pnl >= 0 ? "bg-ag-profit" : "bg-ag-loss"
                      )} />
                      <span className="font-medium text-ag-text-primary">{s.strategy}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right number-display text-ag-text-secondary">
                    {s.trades}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={cn(
                      "number-display font-medium",
                      s.winRate >= 50 ? "text-ag-profit" : "text-ag-loss"
                    )}>
                      {s.winRate}%
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={cn(
                      "number-display font-medium",
                      s.profitFactor >= 1 ? "text-ag-profit" : "text-ag-loss"
                    )}>
                      {s.profitFactor === Infinity ? "∞" : s.profitFactor.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={cn(
                      "number-display font-bold",
                      s.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"
                    )}>
                      {formatCurrency(s.pnl)}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="w-full bg-ag-bg-elevated rounded-full h-2.5">
                      <div
                        className={cn(
                          "h-2.5 rounded-full transition-all duration-500",
                          s.pnl >= 0 ? "bg-ag-profit" : "bg-ag-loss"
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy P&L Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-ag-primary" />
            Strategy P&L Comparison
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} />
                <YAxis type="category" dataKey="strategy" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  content={({ active, payload }: any) =>
                    active && payload?.[0] ? (
                      <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
                        <p className="font-semibold text-ag-text-primary">{payload[0].payload.strategy}</p>
                        <p className={payload[0].payload.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"}>
                          P&L: {formatCurrency(payload[0].payload.pnl)}
                        </p>
                        <p className="text-ag-text-muted text-xs">
                          Win Rate: {payload[0].payload.winRate}% · {payload[0].payload.trades} trades
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                  {strategyData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Radar */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-ag-accent" />
            Strategy Radar
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="strategy" stroke="#94a3b8" fontSize={12} />
                <PolarRadiusAxis stroke="#1e293b" fontSize={10} />
                <Radar name="Win Rate" dataKey="winRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Radar name="Profit Factor" dataKey="profitFactor" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Legend
                  formatter={(value) => <span className="text-xs text-ag-text-secondary">{value}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Instrument & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instrument Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
            Performance by Instrument
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {instrumentData.map((inst) => (
              <div key={inst.instrument} className="text-center p-3 rounded-lg bg-ag-bg-elevated/50">
                <p className="text-xs text-ag-text-muted mb-1">{inst.instrument}</p>
                <p className={cn("text-lg font-bold number-display", inst.pnl >= 0 ? "text-ag-profit" : "text-ag-loss")}>
                  {formatCurrency(inst.pnl)}
                </p>
                <p className="text-xs text-ag-text-muted mt-1">
                  {inst.winRate}% WR · {inst.trades} trades
                </p>
              </div>
            ))}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instrumentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="instrument" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v)} width={60} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {instrumentData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
            Performance by Sector
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    dataKey="trades"
                    nameKey="sector"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {sectorData.map((_, i) => (
                      <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }: any) =>
                      active && payload?.[0] ? (
                        <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
                          <p className="font-semibold text-ag-text-primary">{payload[0].payload.sector}</p>
                          <p className="text-ag-text-secondary">{payload[0].payload.trades} trades</p>
                          <p className={payload[0].payload.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"}>
                            {formatCurrency(payload[0].payload.pnl)}
                          </p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex flex-col justify-center">
              {sectorData.map((s, i) => (
                <div key={s.sector} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                    <span className="text-ag-text-secondary text-xs">{s.sector}</span>
                  </div>
                  <span className={cn("text-xs number-display font-medium", s.pnl >= 0 ? "text-ag-profit" : "text-ag-loss")}>
                    {formatCurrency(s.pnl)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
