"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trade } from "@prisma/client";
import { formatDateShort } from "@/lib/utils";

interface DrawdownChartProps {
  trades: Trade[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="glass-card p-3 !bg-ag-bg-primary/95 border border-ag-border text-sm">
      <p className="text-ag-text-muted text-xs mb-1">
        {formatDateShort(payload[0].payload.date)}
      </p>
      <p className="text-ag-loss font-bold number-display">
        -{payload[0].value.toFixed(2)}%
      </p>
    </div>
  );
}

export default function DrawdownChart({ trades }: DrawdownChartProps) {
  // Calculate drawdown data
  const startingCapital = 500000;
  const data: { date: string; drawdown: number }[] = [];
  
  const dailyPnL = new Map<string, number>();
  trades.forEach(t => {
    const dateStr = t.date instanceof Date ? t.date.toISOString().split('T')[0] : String(t.date).split('T')[0];
    dailyPnL.set(dateStr, (dailyPnL.get(dateStr) || 0) + t.pnl);
  });

  const sortedDates = Array.from(dailyPnL.keys()).sort();
  let cumulative = 0;
  let peak = startingCapital;

  sortedDates.forEach(date => {
    cumulative += dailyPnL.get(date) || 0;
    const equity = startingCapital + cumulative;
    peak = Math.max(peak, equity);
    const ddPercent = peak > 0 ? ((peak - equity) / startingCapital) * 100 : 0;
    data.push({ date, drawdown: ddPercent });
  });

  if (data.length === 0) {
    data.push({ date: new Date().toISOString().split('T')[0], drawdown: 0 });
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
        Drawdown
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatDateShort(v)}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `-${v}%`}
              width={50}
              reversed
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#ddFill)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
