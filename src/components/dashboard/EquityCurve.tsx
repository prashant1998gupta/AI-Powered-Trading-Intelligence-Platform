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
import { getEquityCurve } from "@/data/mockTrades";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const data = getEquityCurve();

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
      <p className="text-ag-primary font-bold number-display">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function EquityCurve() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
        Equity Curve
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              tickFormatter={(v) => formatCurrency(v)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#equityFill)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
