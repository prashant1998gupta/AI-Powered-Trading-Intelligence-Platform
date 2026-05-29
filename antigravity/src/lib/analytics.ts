import { mockTrades, type Trade, getDailyPnL } from "@/data/mockTrades";

/** Calculate overall win rate */
export function calculateWinRate(trades: Trade[] = mockTrades): number {
  if (trades.length === 0) return 0;
  const wins = trades.filter((t) => t.pnl > 0).length;
  return Math.round((wins / trades.length) * 10000) / 100;
}

/** Calculate profit factor (gross profit / gross loss) */
export function calculateProfitFactor(trades: Trade[] = mockTrades): number {
  const grossProfit = trades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return Math.round((grossProfit / grossLoss) * 100) / 100;
}

/** Calculate risk-reward ratio (avg win / avg loss) */
export function calculateRiskReward(trades: Trade[] = mockTrades): number {
  const winners = trades.filter((t) => t.pnl > 0);
  const losers = trades.filter((t) => t.pnl < 0);
  if (losers.length === 0) return Infinity;
  const avgWin = winners.reduce((sum, t) => sum + t.pnl, 0) / (winners.length || 1);
  const avgLoss = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length);
  return Math.round((avgWin / avgLoss) * 100) / 100;
}

/** Calculate maximum drawdown */
export function calculateMaxDrawdown(
  startingCapital = 500000
): { amount: number; percent: number } {
  const daily = getDailyPnL();
  let peak = startingCapital;
  let maxDD = 0;

  daily.forEach((d) => {
    const equity = startingCapital + d.cumulativePnl;
    peak = Math.max(peak, equity);
    const dd = peak - equity;
    maxDD = Math.max(maxDD, dd);
  });

  return {
    amount: Math.round(maxDD),
    percent: Math.round((maxDD / startingCapital) * 10000) / 100,
  };
}

/** Get performance by strategy */
export function getPerformanceByStrategy(trades: Trade[] = mockTrades) {
  const strategyMap = new Map<
    string,
    { trades: number; wins: number; pnl: number; grossProfit: number; grossLoss: number }
  >();

  trades.forEach((t) => {
    const existing = strategyMap.get(t.strategy) || {
      trades: 0, wins: 0, pnl: 0, grossProfit: 0, grossLoss: 0,
    };
    existing.trades++;
    if (t.pnl > 0) {
      existing.wins++;
      existing.grossProfit += t.pnl;
    } else {
      existing.grossLoss += Math.abs(t.pnl);
    }
    existing.pnl += t.pnl;
    strategyMap.set(t.strategy, existing);
  });

  return Array.from(strategyMap.entries()).map(([strategy, data]) => ({
    strategy,
    trades: data.trades,
    wins: data.wins,
    winRate: Math.round((data.wins / data.trades) * 10000) / 100,
    pnl: Math.round(data.pnl),
    profitFactor: data.grossLoss > 0
      ? Math.round((data.grossProfit / data.grossLoss) * 100) / 100
      : data.grossProfit > 0 ? Infinity : 0,
  }));
}

/** Get performance by sector */
export function getPerformanceBySector(trades: Trade[] = mockTrades) {
  const sectorMap = new Map<string, { trades: number; wins: number; pnl: number }>();

  trades.forEach((t) => {
    const existing = sectorMap.get(t.sector) || { trades: 0, wins: 0, pnl: 0 };
    existing.trades++;
    if (t.pnl > 0) existing.wins++;
    existing.pnl += t.pnl;
    sectorMap.set(t.sector, existing);
  });

  return Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    trades: data.trades,
    winRate: Math.round((data.wins / data.trades) * 10000) / 100,
    pnl: Math.round(data.pnl),
  }));
}

/** Get performance by instrument */
export function getPerformanceByInstrument(trades: Trade[] = mockTrades) {
  const instrumentMap = new Map<string, { trades: number; wins: number; pnl: number }>();

  trades.forEach((t) => {
    const existing = instrumentMap.get(t.instrument) || { trades: 0, wins: 0, pnl: 0 };
    existing.trades++;
    if (t.pnl > 0) existing.wins++;
    existing.pnl += t.pnl;
    instrumentMap.set(t.instrument, existing);
  });

  return Array.from(instrumentMap.entries()).map(([instrument, data]) => ({
    instrument,
    trades: data.trades,
    winRate: Math.round((data.wins / data.trades) * 10000) / 100,
    pnl: Math.round(data.pnl),
  }));
}

/** Get performance by day of week */
export function getPerformanceByDayOfWeek(trades: Trade[] = mockTrades) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayMap = new Map<string, { trades: number; wins: number; pnl: number }>();

  trades.forEach((t) => {
    const day = days[new Date(t.date).getDay()];
    const existing = dayMap.get(day) || { trades: 0, wins: 0, pnl: 0 };
    existing.trades++;
    if (t.pnl > 0) existing.wins++;
    existing.pnl += t.pnl;
    dayMap.set(day, existing);
  });

  return ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
    const data = dayMap.get(day) || { trades: 0, wins: 0, pnl: 0 };
    return {
      day,
      trades: data.trades,
      winRate: data.trades > 0 ? Math.round((data.wins / data.trades) * 10000) / 100 : 0,
      pnl: Math.round(data.pnl),
    };
  });
}

/** Get performance by hour */
export function getPerformanceByHour(trades: Trade[] = mockTrades) {
  const hourMap = new Map<number, { trades: number; wins: number; pnl: number }>();

  trades.forEach((t) => {
    const hour = parseInt(t.time.split(":")[0]);
    const existing = hourMap.get(hour) || { trades: 0, wins: 0, pnl: 0 };
    existing.trades++;
    if (t.pnl > 0) existing.wins++;
    existing.pnl += t.pnl;
    hourMap.set(hour, existing);
  });

  return Array.from(hourMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([hour, data]) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      trades: data.trades,
      winRate: data.trades > 0 ? Math.round((data.wins / data.trades) * 10000) / 100 : 0,
      pnl: Math.round(data.pnl),
    }));
}

/** Detect revenge trading patterns */
export function detectRevengeTrading(trades: Trade[] = mockTrades): number {
  let count = 0;
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = `${a.date}T${a.time}`;
    const dateB = `${b.date}T${b.time}`;
    return dateA.localeCompare(dateB);
  });

  for (let i = 2; i < sortedTrades.length; i++) {
    if (
      sortedTrades[i - 2].pnl < 0 &&
      sortedTrades[i - 1].pnl < 0 &&
      sortedTrades[i].quantity > sortedTrades[i - 1].quantity * 1.5 &&
      sortedTrades[i].date === sortedTrades[i - 1].date
    ) {
      count++;
    }
  }
  return count;
}

/** Detect overtrading days */
export function detectOvertrading(trades: Trade[] = mockTrades, threshold = 6): number {
  const dailyCount = new Map<string, number>();
  trades.forEach((t) => {
    dailyCount.set(t.date, (dailyCount.get(t.date) || 0) + 1);
  });
  return Array.from(dailyCount.values()).filter((c) => c > threshold).length;
}

/** Calculate behavioral score (0-100) */
export function calculateBehaviorScore(trades: Trade[] = mockTrades): number {
  const revenge = detectRevengeTrading(trades);
  const overtrading = detectOvertrading(trades);
  const rr = calculateRiskReward(trades);
  const winRate = calculateWinRate(trades);

  let score = 100;
  score -= revenge * 5;
  score -= overtrading * 3;
  if (rr < 1) score -= 15;
  if (winRate < 40) score -= 10;
  if (winRate < 50) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Calculate risk score (0-100, higher = riskier) */
export function calculateRiskScore(trades: Trade[] = mockTrades): number {
  const dd = calculateMaxDrawdown();
  const pf = calculateProfitFactor(trades);
  const concentration = getPerformanceBySector(trades);
  const maxSectorPct = Math.max(
    ...concentration.map((s) => s.trades / trades.length)
  ) * 100;

  let score = 0;
  score += Math.min(40, dd.percent * 3);
  if (pf < 1) score += 20;
  else if (pf < 1.5) score += 10;
  score += Math.max(0, maxSectorPct - 30) * 0.5;

  return Math.min(100, Math.round(score));
}

/** Get trading heatmap data (hour x day) */
export function getTradingHeatmap(trades: Trade[] = mockTrades) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = Array.from({ length: 7 }, (_, i) => i + 9);
  const heatmap: { day: string; hour: string; count: number; pnl: number }[] = [];

  const dataMap = new Map<string, { count: number; pnl: number }>();
  trades.forEach((t) => {
    const dayIdx = new Date(t.date).getDay();
    if (dayIdx < 1 || dayIdx > 5) return;
    const day = days[dayIdx - 1];
    const hour = parseInt(t.time.split(":")[0]);
    const key = `${day}-${hour}`;
    const existing = dataMap.get(key) || { count: 0, pnl: 0 };
    existing.count++;
    existing.pnl += t.pnl;
    dataMap.set(key, existing);
  });

  days.forEach((day) => {
    hours.forEach((hour) => {
      const key = `${day}-${hour}`;
      const data = dataMap.get(key) || { count: 0, pnl: 0 };
      heatmap.push({
        day,
        hour: `${String(hour).padStart(2, "0")}:00`,
        count: data.count,
        pnl: Math.round(data.pnl),
      });
    });
  });

  return heatmap;
}
