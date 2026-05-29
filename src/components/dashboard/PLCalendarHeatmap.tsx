"use client";

import { getDailyPnL } from "@/data/mockTrades";
import { cn, formatCurrencyFull } from "@/lib/utils";

const dailyData = getDailyPnL();

// Group by month and week
function getCalendarData() {
  const months: Map<string, { date: string; pnl: number; dayOfMonth: number; dayOfWeek: number }[]> = new Map();

  dailyData.forEach((d) => {
    const date = new Date(d.date);
    const monthKey = date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    if (!months.has(monthKey)) months.set(monthKey, []);
    months.get(monthKey)!.push({
      date: d.date,
      pnl: d.pnl,
      dayOfMonth: date.getDate(),
      dayOfWeek: date.getDay(),
    });
  });

  return months;
}

function getPnlColor(pnl: number): string {
  if (pnl === 0) return "bg-ag-bg-elevated";
  const intensity = Math.min(Math.abs(pnl) / 5000, 1);
  if (pnl > 0) {
    if (intensity > 0.7) return "bg-emerald-500/60";
    if (intensity > 0.4) return "bg-emerald-500/35";
    return "bg-emerald-500/15";
  } else {
    if (intensity > 0.7) return "bg-red-500/60";
    if (intensity > 0.4) return "bg-red-500/35";
    return "bg-red-500/15";
  }
}

export default function PLCalendarHeatmap() {
  const calendarData = getCalendarData();
  const months = Array.from(calendarData.entries());

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-ag-text-primary mb-4">
        P&L Calendar
      </h3>

      <div className="space-y-6">
        {months.map(([month, days]) => (
          <div key={month}>
            <p className="text-xs text-ag-text-muted mb-2 font-medium">{month}</p>
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={`${month}-h-${i}`} className="text-[10px] text-ag-text-muted text-center pb-1">
                  {d}
                </div>
              ))}

              {/* Empty slots for first week alignment */}
              {days.length > 0 &&
                Array.from({ length: (days[0].dayOfWeek + 6) % 7 }).map((_, i) => (
                  <div key={`${month}-e-${i}`} className="aspect-square" />
                ))}

              {/* Day cells */}
              {days.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "aspect-square rounded-sm flex items-center justify-center text-[9px] font-medium cursor-default transition-transform hover:scale-125 relative group",
                    getPnlColor(day.pnl)
                  )}
                  title={`${day.date}: ${formatCurrencyFull(day.pnl)}`}
                >
                  <span className="text-ag-text-primary/70">{day.dayOfMonth}</span>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap">
                    <div className="glass-card !bg-ag-bg-primary/95 px-2 py-1 text-[10px] border border-ag-border">
                      <span className={day.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"}>
                        {formatCurrencyFull(day.pnl)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-ag-text-muted">
        <span>Loss</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-red-500/60" />
          <div className="w-3 h-3 rounded-sm bg-red-500/35" />
          <div className="w-3 h-3 rounded-sm bg-red-500/15" />
          <div className="w-3 h-3 rounded-sm bg-ag-bg-elevated" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/15" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/35" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500/60" />
        </div>
        <span>Profit</span>
      </div>
    </div>
  );
}
