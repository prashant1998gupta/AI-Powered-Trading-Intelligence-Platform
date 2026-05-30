"use client";

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
import { getPerformanceByDayOfWeek } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Trade } from "@prisma/client";

interface DayOfWeekChartProps {
  trades: Trade[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { day: string; pnl: number; winRate: number; trades: number } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
      <p className="text-ag-text-muted text-xs mb-2">{d.day}</p>
      <p className={d.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"}>
        <span className="font-bold number-display">{formatCurrency(d.pnl)}</span>
      </p>
      <p className="text-ag-text-muted text-xs mt-1">
        Win Rate: {d.winRate}% · {d.trades} trades
      </p>
    </div>
  );
}

export default function DayOfWeekChart({ trades }: DayOfWeekChartProps) {
  const data = getPerformanceByDayOfWeek(trades);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
        Performance by Day
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]} animationDuration={1200}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
