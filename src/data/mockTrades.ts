export interface Trade {
  id: string;
  date: string;
  time: string;
  symbol: string;
  instrument: "Stocks" | "Options" | "Futures";
  sector: "Banking" | "IT" | "Pharma" | "Auto" | "Energy" | "FMCG" | "Metal" | "Index";
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  strategy: "Scalping" | "Intraday" | "Swing" | "Positional";
  holdingTime: string;
  brokerage: number;
  notes?: string;
  tags?: string[];
  broker: "Groww" | "Zerodha" | "Upstox";
}

const symbols = [
  { name: "RELIANCE", sector: "Energy" as const, base: 2450 },
  { name: "TCS", sector: "IT" as const, base: 3350 },
  { name: "HDFCBANK", sector: "Banking" as const, base: 1580 },
  { name: "INFY", sector: "IT" as const, base: 1420 },
  { name: "ICICIBANK", sector: "Banking" as const, base: 940 },
  { name: "SBIN", sector: "Banking" as const, base: 620 },
  { name: "TATAMOTORS", sector: "Auto" as const, base: 680 },
  { name: "SUNPHARMA", sector: "Pharma" as const, base: 1150 },
  { name: "WIPRO", sector: "IT" as const, base: 440 },
  { name: "BAJFINANCE", sector: "Banking" as const, base: 6800 },
  { name: "MARUTI", sector: "Auto" as const, base: 10200 },
  { name: "HINDALCO", sector: "Metal" as const, base: 480 },
  { name: "TATASTEEL", sector: "Metal" as const, base: 128 },
  { name: "ITC", sector: "FMCG" as const, base: 440 },
  { name: "BANKNIFTY", sector: "Index" as const, base: 48500 },
  { name: "NIFTY50", sector: "Index" as const, base: 22500 },
];

const strategies: Trade["strategy"][] = ["Scalping", "Intraday", "Swing", "Positional"];
const instruments: Trade["instrument"][] = ["Stocks", "Options", "Futures"];
const brokers: Trade["broker"][] = ["Groww", "Zerodha", "Upstox"];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateTrades(): Trade[] {
  const trades: Trade[] = [];
  const rng = seededRandom(42);

  const startDate = new Date("2025-02-01");
  const endDate = new Date("2025-04-30");
  const currentDate = new Date(startDate);
  let id = 1;

  while (currentDate <= endDate) {
    const day = currentDate.getDay();
    if (day === 0 || day === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    const tradesPerDay = Math.floor(rng() * 5) + 1;

    for (let t = 0; t < tradesPerDay; t++) {
      const sym = symbols[Math.floor(rng() * symbols.length)];
      const strategy = strategies[Math.floor(rng() * strategies.length)];
      const instrument =
        sym.sector === "Index"
          ? rng() > 0.3
            ? "Options"
            : "Futures"
          : instruments[Math.floor(rng() * instruments.length)];

      // consume one rng call for realism
      rng();
      rng();
      const entryPrice =
        instrument === "Options"
          ? Math.round((rng() * 300 + 50) * 100) / 100
          : Math.round((sym.base + (rng() - 0.5) * sym.base * 0.05) * 100) / 100;

      const exitMultiplier = instrument === "Options" ? 0.2 : 0.02;
      const exitPrice =
        Math.round((entryPrice + (rng() - 0.43) * entryPrice * exitMultiplier) * 100) / 100;

      const quantity =
        instrument === "Options"
          ? (Math.floor(rng() * 10) + 1) * 25
          : instrument === "Futures"
          ? (Math.floor(rng() * 3) + 1) * 25
          : Math.floor(rng() * 50) + 5;

      const side = rng() > 0.5 ? "BUY" : "SELL";
      const rawPnl =
        side === "BUY"
          ? (exitPrice - entryPrice) * quantity
          : (entryPrice - exitPrice) * quantity;
      const pnl = Math.round(rawPnl * 100) / 100;
      const pnlPercent =
        Math.round(((exitPrice - entryPrice) / entryPrice) * 10000) / 100;

      const hour = Math.floor(rng() * 6) + 9;
      const minute = Math.floor(rng() * 60);

      const holdingMinutes =
        strategy === "Scalping"
          ? Math.floor(rng() * 15) + 1
          : strategy === "Intraday"
          ? Math.floor(rng() * 300) + 15
          : strategy === "Swing"
          ? Math.floor(rng() * 4320) + 1440
          : Math.floor(rng() * 43200) + 4320;

      const holdDays = Math.floor(holdingMinutes / 1440);
      const holdHours = Math.floor((holdingMinutes % 1440) / 60);
      const holdMins = holdingMinutes % 60;
      const holdingTime =
        holdDays > 0
          ? `${holdDays}d ${holdHours}h`
          : holdHours > 0
          ? `${holdHours}h ${holdMins}m`
          : `${holdMins}m`;

      trades.push({
        id: `TR-${String(id).padStart(4, "0")}`,
        date: currentDate.toISOString().split("T")[0],
        time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        symbol: sym.name,
        instrument,
        sector: sym.sector,
        side: side as Trade["side"],
        quantity,
        entryPrice,
        exitPrice,
        pnl,
        pnlPercent,
        strategy,
        holdingTime,
        brokerage: Math.round(pnl * 0.01 * 100) / 100,
        broker: brokers[Math.floor(rng() * brokers.length)],
        tags:
          rng() > 0.7
            ? ["breakout"]
            : rng() > 0.5
            ? ["momentum"]
            : rng() > 0.3
            ? ["reversal"]
            : undefined,
      });
      id++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trades;
}

export const mockTrades: Trade[] = generateTrades();

// Pre-computed daily P&L
export interface DailyPnL {
  date: string;
  pnl: number;
  tradeCount: number;
  winCount: number;
  cumulativePnl: number;
}

export function getDailyPnL(): DailyPnL[] {
  const dailyMap = new Map<string, { pnl: number; trades: number; wins: number }>();

  mockTrades.forEach((t) => {
    const existing = dailyMap.get(t.date) || { pnl: 0, trades: 0, wins: 0 };
    existing.pnl += t.pnl;
    existing.trades++;
    if (t.pnl > 0) existing.wins++;
    dailyMap.set(t.date, existing);
  });

  const sorted = Array.from(dailyMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  let cumulative = 0;

  return sorted.map(([date, data]) => {
    cumulative += data.pnl;
    return {
      date,
      pnl: Math.round(data.pnl * 100) / 100,
      tradeCount: data.trades,
      winCount: data.wins,
      cumulativePnl: Math.round(cumulative * 100) / 100,
    };
  });
}

// Equity curve data
export interface EquityPoint {
  date: string;
  equity: number;
  drawdown: number;
}

export function getEquityCurve(): EquityPoint[] {
  const daily = getDailyPnL();
  const startingCapital = 500000;
  let peak = startingCapital;

  return daily.map((d) => {
    const equity = startingCapital + d.cumulativePnl;
    peak = Math.max(peak, equity);
    const drawdown = ((equity - peak) / peak) * 100;
    return {
      date: d.date,
      equity: Math.round(equity),
      drawdown: Math.round(drawdown * 100) / 100,
    };
  });
}
