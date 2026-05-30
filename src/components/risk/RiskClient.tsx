"use client";

import { cn, formatCurrency } from "@/lib/utils";
import {
  calculateRiskScore,
  calculateMaxDrawdown,
  getPerformanceBySector,
  getPerformanceByInstrument,
} from "@/lib/analytics";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Treemap,
} from "recharts";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Gauge,
  DollarSign,
  PieChart as PieIcon,
  Bell,
  ChevronRight,
  XCircle,
  Info,
} from "lucide-react";
import { Trade, Insight } from "@prisma/client";

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#f97316"];

function RiskGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 60;
  const progress = (score / 100) * circumference * 0.75;
  const color = score <= 30 ? "#10b981" : score <= 60 ? "#f59e0b" : "#ef4444";
  const label = score <= 30 ? "Low Risk" : score <= 60 ? "Moderate Risk" : "High Risk";

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-[135deg]">
        <circle
          cx="70" cy="70" r="60"
          fill="none" stroke="#1e293b" strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeLinecap="round"
        />
        <circle
          cx="70" cy="70" r="60"
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold number-display" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-ag-text-muted mt-1">{label}</span>
      </div>
    </div>
  );
}

interface RiskClientProps {
  trades: Trade[];
  insights: Insight[];
}

export default function RiskClient({ trades, insights }: RiskClientProps) {
  const riskScore = calculateRiskScore(trades);
  const maxDD = calculateMaxDrawdown(trades);
  const sectorData = getPerformanceBySector(trades);
  const instrumentData = getPerformanceByInstrument(trades);

  // Calculate actual total P&L instead of mock
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const capitalDeployed = 500000;
  const totalPnlPercent = (totalPnl / capitalDeployed) * 100;

  // Filter actual insights for risk
  const riskAlerts = insights.filter((i) => i.category === "risk" || i.type === "danger");

  // Portfolio exposure treemap data
  const treemapData = sectorData.map((s, i) => ({
    name: s.sector,
    size: s.trades,
    pnl: s.pnl,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ag-text-primary">
          Risk Intelligence
        </h1>
        <p className="text-sm text-ag-text-secondary mt-1">
          Monitor portfolio risk, exposure, and capital allocation
        </p>
      </div>

      {/* Top Row: Risk Score + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Risk Score */}
        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-ag-primary" />
            <h3 className="text-sm font-semibold text-ag-text-primary">
              Risk Score
            </h3>
          </div>
          <RiskGauge score={riskScore} />
          <p className="text-xs text-ag-text-secondary mt-4">
            Based on drawdown, concentration, and profit factor
          </p>
        </div>

        {/* Risk KPIs */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-ag-loss" />
              <p className="text-sm text-ag-text-muted">Max Drawdown</p>
            </div>
            <p className="text-3xl font-bold number-display text-ag-loss">
              {formatCurrency(maxDD.amount)}
            </p>
            <p className="text-sm text-ag-text-muted mt-1">
              {maxDD.percent.toFixed(2)}% of capital
            </p>
            <div className="mt-3 w-full bg-ag-bg-elevated rounded-full h-2">
              <div
                className="h-2 rounded-full bg-ag-loss transition-all"
                style={{ width: `${Math.min(maxDD.percent * 6.67, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-ag-text-muted mt-1">
              15% limit threshold
            </p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-ag-primary" />
              <p className="text-sm text-ag-text-muted">Capital Deployed</p>
            </div>
            <p className="text-3xl font-bold number-display text-ag-text-primary">
              {formatCurrency(capitalDeployed)}
            </p>
            <p className="text-sm text-ag-text-muted mt-1">
              Current equity: {formatCurrency(capitalDeployed + totalPnl)}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                "text-sm font-bold number-display",
                totalPnl >= 0 ? "text-ag-profit" : "text-ag-loss"
              )}>
                {totalPnl >= 0 ? "+" : ""}{totalPnlPercent.toFixed(2)}%
              </span>
              <span className="text-xs text-ag-text-muted">return on capital</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-ag-warning" />
              <p className="text-sm text-ag-text-muted">Daily Risk Budget</p>
            </div>
            <p className="text-3xl font-bold number-display text-ag-warning">
              ₹5,000
            </p>
            <p className="text-sm text-ag-text-muted mt-1">
              Used today: ₹0 (0%)
            </p>
            <div className="mt-3 w-full bg-ag-bg-elevated rounded-full h-2">
              <div className="h-2 rounded-full bg-ag-warning transition-all" style={{ width: "0%" }} />
            </div>
            <p className="text-[10px] text-ag-text-muted mt-1">
              ₹5,000 remaining
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Exposure Treemap */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-ag-primary" />
            Portfolio Exposure
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#1e293b"
                content={(props: any) => {
                  const { x, y, width, height, name } = props;
                  const fill = props.fill || "#3b82f6";
                  if (width < 40 || height < 30) return <g />;
                  return (
                    <g>
                      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.6} rx={4} />
                      <text
                        x={x + width / 2}
                        y={y + height / 2 - 6}
                        textAnchor="middle"
                        fill="#f1f5f9"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {name}
                      </text>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 10}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize={10}
                      >
                        {treemapData.find((d) => d.name === name)?.size} trades
                      </text>
                    </g>
                  );
                }}
              />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Concentration Risk */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
            Concentration Risk
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={instrumentData}
                    dataKey="trades"
                    nameKey="instrument"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {instrumentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={({ active, payload }: any) =>
                      active && payload?.[0] ? (
                        <div className="glass-card p-2 !bg-ag-bg-primary/95 border border-ag-border text-xs">
                          <p className="font-semibold text-ag-text-primary">{payload[0].payload.instrument}</p>
                          <p className="text-ag-text-muted">{payload[0].payload.trades} trades ({payload[0].payload.winRate}% WR)</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex flex-col justify-center">
              {instrumentData.map((inst, i) => {
                const totalTrades = instrumentData.reduce((s, d) => s + d.trades, 0);
                const pct = totalTrades > 0 ? Math.round((inst.trades / totalTrades) * 100) : 0;
                return (
                  <div key={inst.instrument}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-ag-text-secondary text-xs">{inst.instrument}</span>
                      </div>
                      <span className="text-xs number-display text-ag-text-primary font-medium">{pct}%</span>
                    </div>
                    <div className="w-full bg-ag-bg-elevated rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ag-text-primary flex items-center gap-2">
            <Bell className="w-4 h-4 text-ag-warning" />
            Active Risk Alerts
          </h3>
          <span className="badge-loss">{riskAlerts.length} Active</span>
        </div>
        <div className="space-y-3">
          {riskAlerts.length === 0 && (
            <p className="text-sm text-ag-text-muted text-center py-4">No active risk alerts. Great job managing risk!</p>
          )}
          {riskAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-ag-loss-dim/30 border border-ag-loss/20 hover:bg-ag-loss-dim/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-ag-loss-dim flex items-center justify-center flex-shrink-0">
                {alert.type === "danger" ? (
                  <XCircle className="w-4 h-4 text-ag-loss" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-ag-warning" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ag-text-primary">
                  {alert.title}
                </p>
                <p className="text-xs text-ag-text-secondary mt-1">
                  {alert.description}
                </p>
                {alert.action && (
                  <p className="text-xs text-ag-accent mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {alert.action}
                  </p>
                )}
              </div>
              <button className="text-ag-text-muted hover:text-ag-text-primary transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
