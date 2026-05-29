"use client";

import {
  TrendingUp,
  Percent,
  Scale,
  AlertTriangle,
} from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import EquityCurve from "@/components/dashboard/EquityCurve";
import PLCalendarHeatmap from "@/components/dashboard/PLCalendarHeatmap";
import DrawdownChart from "@/components/dashboard/DrawdownChart";
import DayOfWeekChart from "@/components/dashboard/DayOfWeekChart";
import RecentTradesTable from "@/components/dashboard/RecentTradesTable";
import AIInsightsPanel from "@/components/dashboard/AIInsightsPanel";
import { mockAccountSummary } from "@/data/mockUser";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const summary = mockAccountSummary;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ag-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-ag-text-secondary mt-1">
            Performance overview · Feb 2025 — Apr 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input-dark text-sm !py-2">
            <option>Last 3 Months</option>
            <option>Last Month</option>
            <option>Last Week</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total P&L"
          value={formatCurrency(summary.totalPnl)}
          trend={summary.totalPnlPercent}
          trendLabel="of capital"
          icon={TrendingUp}
          color="profit"
        />
        <KPICard
          title="Win Rate"
          value={`${summary.winRate}%`}
          trend={3.2}
          trendLabel="vs last month"
          icon={Percent}
          color="accent"
        />
        <KPICard
          title="Profit Factor"
          value={summary.profitFactor.toFixed(2)}
          trend={0.18}
          trendLabel="vs last month"
          icon={Scale}
          color="primary"
        />
        <KPICard
          title="Max Drawdown"
          value={formatPercent(-summary.maxDrawdownPercent)}
          trend={-2.1}
          trendLabel="from peak"
          icon={AlertTriangle}
          color="loss"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EquityCurve />
        </div>
        <div>
          <PLCalendarHeatmap />
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DrawdownChart />
        <DayOfWeekChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTradesTable />
        </div>
        <div>
          <AIInsightsPanel />
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="glass-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: "Total Trades", value: summary.totalTrades.toString() },
            { label: "Winning", value: summary.winningTrades.toString() },
            { label: "Losing", value: summary.losingTrades.toString() },
            { label: "Avg Win", value: formatCurrency(summary.averageWin) },
            { label: "Avg Loss", value: formatCurrency(summary.averageLoss) },
            { label: "Best Trade", value: formatCurrency(summary.bestTrade) },
            { label: "Worst Trade", value: formatCurrency(summary.worstTrade) },
            { label: "Sharpe Ratio", value: summary.sharpeRatio.toFixed(2) },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs text-ag-text-muted mb-1">{stat.label}</p>
              <p className="text-sm font-bold number-display text-ag-text-primary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
