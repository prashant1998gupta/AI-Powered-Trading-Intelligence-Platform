/**
 * CSV Trade Parsers for Indian Brokers
 * Supports: Zerodha, Groww, Upstox, Angel One
 * Auto-detects broker from CSV headers
 */

export interface ParsedTrade {
  date: Date;
  time: string;
  symbol: string;
  instrument: string;
  sector: string;
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  strategy: string;
  holdingTime: string;
  brokerage: number;
  notes: string;
  broker: string;
}

/** Parse raw CSV text into rows */
function parseCSVRows(csvText: string): string[][] {
  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/** Detect broker from CSV headers */
export function detectBroker(csvText: string): string | null {
  const firstLine = csvText.split(/\r?\n/)[0].toLowerCase();

  if (
    firstLine.includes("trade_id") &&
    firstLine.includes("order_id") &&
    firstLine.includes("trade_type")
  ) {
    return "Zerodha";
  }

  if (
    firstLine.includes("symbol") &&
    firstLine.includes("segment") &&
    (firstLine.includes("order no") || firstLine.includes("order_no"))
  ) {
    return "Groww";
  }

  if (
    firstLine.includes("scrip") ||
    (firstLine.includes("symbol") && firstLine.includes("avg") && firstLine.includes("net"))
  ) {
    return "Upstox";
  }

  if (
    firstLine.includes("trade no") ||
    firstLine.includes("trade_no") ||
    (firstLine.includes("symbol") && firstLine.includes("client"))
  ) {
    return "Angel One";
  }

  // Fallback: try generic CSV
  if (
    firstLine.includes("symbol") &&
    (firstLine.includes("quantity") || firstLine.includes("qty")) &&
    (firstLine.includes("price") || firstLine.includes("entry"))
  ) {
    return "Generic";
  }

  return null;
}

/** Map sector from symbol name (basic mapping) */
function inferSector(symbol: string): string {
  const sectorMap: Record<string, string> = {
    NIFTY: "Index",
    BANKNIFTY: "Index",
    FINNIFTY: "Index",
    SENSEX: "Index",
    HDFCBANK: "Banking",
    ICICIBANK: "Banking",
    SBIN: "Banking",
    KOTAKBANK: "Banking",
    AXISBANK: "Banking",
    RELIANCE: "Energy",
    ONGC: "Energy",
    NTPC: "Energy",
    POWERGRID: "Energy",
    TCS: "IT",
    INFY: "IT",
    WIPRO: "IT",
    HCLTECH: "IT",
    TECHM: "IT",
    HINDUNILVR: "FMCG",
    ITC: "FMCG",
    NESTLEIND: "FMCG",
    BAJFINANCE: "Finance",
    BAJAJFINSV: "Finance",
    TATAMOTORS: "Auto",
    MARUTI: "Auto",
    M_M: "Auto",
    TATASTEEL: "Metals",
    HINDALCO: "Metals",
    JSWSTEEL: "Metals",
    SUNPHARMA: "Pharma",
    DRREDDY: "Pharma",
    CIPLA: "Pharma",
    BHARTIARTL: "Telecom",
    ADANIENT: "Conglomerate",
    ADANIPORTS: "Infrastructure",
    TITAN: "Consumer",
    ASIANPAINT: "Consumer",
    LTIM: "IT",
    LT: "Infrastructure",
  };

  const baseSymbol = symbol.replace(/\d+[A-Z]*$/i, "").toUpperCase();
  return sectorMap[baseSymbol] || "Other";
}

/** Infer instrument type from symbol */
function inferInstrument(symbol: string, segment?: string): string {
  if (segment) {
    const seg = segment.toLowerCase();
    if (seg.includes("opt") || seg.includes("option")) return "Options";
    if (seg.includes("fut") || seg.includes("future")) return "Futures";
    if (seg.includes("eq") || seg.includes("cash") || seg.includes("delivery")) return "Stocks";
  }

  // Infer from symbol pattern
  if (/\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\d+(CE|PE)/i.test(symbol)) {
    return "Options";
  }
  if (/\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)FUT/i.test(symbol)) {
    return "Futures";
  }
  return "Stocks";
}

// ========================================
// ZERODHA PARSER
// ========================================
// Zerodha Tradebook CSV columns:
// trade_id, order_id, symbol, isin, trade_date, exchange, segment,
// series, trade_type, auction, quantity, price, trade_id, order_id,
// order_execution_time

function parseZerodha(csvText: string): ParsedTrade[] {
  const rows = parseCSVRows(csvText);
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const dataRows = rows.slice(1);

  const colIdx = (name: string) =>
    headers.findIndex((h) => h.includes(name));

  const symbolIdx = colIdx("symbol");
  const dateIdx = colIdx("trade_date");
  const tradeTypeIdx = colIdx("trade_type");
  const qtyIdx = colIdx("quantity");
  const priceIdx = colIdx("price");
  const segmentIdx = colIdx("segment");
  const timeIdx = colIdx("order_execution_time");

  // Group by symbol + date to pair BUY/SELL
  const tradeMap = new Map<string, { buys: typeof dataRows; sells: typeof dataRows }>();

  dataRows.forEach((row) => {
    if (row.length <= symbolIdx) return;
    const symbol = row[symbolIdx];
    const date = row[dateIdx];
    const key = `${symbol}-${date}`;

    if (!tradeMap.has(key)) tradeMap.set(key, { buys: [], sells: [] });
    const group = tradeMap.get(key)!;

    if (row[tradeTypeIdx]?.toLowerCase() === "buy") {
      group.buys.push(row);
    } else {
      group.sells.push(row);
    }
  });

  const trades: ParsedTrade[] = [];

  tradeMap.forEach((group, key) => {
    const [symbol] = key.split("-");
    const segment = group.buys[0]?.[segmentIdx] || group.sells[0]?.[segmentIdx] || "";

    // Calculate average entry/exit from buys and sells
    const calcAvg = (rows: string[][]) => {
      let totalQty = 0;
      let totalValue = 0;
      rows.forEach((r) => {
        const qty = parseFloat(r[qtyIdx]) || 0;
        const price = parseFloat(r[priceIdx]) || 0;
        totalQty += qty;
        totalValue += qty * price;
      });
      return { qty: totalQty, avgPrice: totalQty > 0 ? totalValue / totalQty : 0 };
    };

    const buyData = calcAvg(group.buys);
    const sellData = calcAvg(group.sells);
    const qty = Math.min(buyData.qty, sellData.qty);

    if (qty === 0) return;

    const entryPrice = buyData.avgPrice;
    const exitPrice = sellData.avgPrice;
    const pnl = (exitPrice - entryPrice) * qty;
    const dateStr = group.buys[0]?.[dateIdx] || group.sells[0]?.[dateIdx];
    const timeStr = group.buys[0]?.[timeIdx]?.split(" ").pop()?.substring(0, 5) || "09:15";

    trades.push({
      date: new Date(dateStr),
      time: timeStr,
      symbol,
      instrument: inferInstrument(symbol, segment),
      sector: inferSector(symbol),
      side: "BUY",
      quantity: qty,
      entryPrice,
      exitPrice,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: entryPrice > 0 ? Math.round(((exitPrice - entryPrice) / entryPrice) * 10000) / 100 : 0,
      strategy: "Imported",
      holdingTime: "Intraday",
      brokerage: 40,
      notes: "Imported from Zerodha",
      broker: "Zerodha",
    });
  });

  return trades;
}

// ========================================
// GROWW PARSER
// ========================================
function parseGroww(csvText: string): ParsedTrade[] {
  const rows = parseCSVRows(csvText);
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const dataRows = rows.slice(1);

  const colIdx = (name: string) =>
    headers.findIndex((h) => h.includes(name));

  const symbolIdx = colIdx("symbol");
  const dateIdx = colIdx("date");
  const tradeTypeIdx = colIdx("trade_type") !== -1 ? colIdx("trade_type") : colIdx("type");
  const qtyIdx = colIdx("quantity") !== -1 ? colIdx("quantity") : colIdx("qty");
  const priceIdx = colIdx("price");
  const segmentIdx = colIdx("segment");

  const tradeMap = new Map<string, { buys: typeof dataRows; sells: typeof dataRows }>();

  dataRows.forEach((row) => {
    if (row.length <= symbolIdx) return;
    const symbol = row[symbolIdx];
    const date = row[dateIdx];
    const key = `${symbol}-${date}`;

    if (!tradeMap.has(key)) tradeMap.set(key, { buys: [], sells: [] });
    const group = tradeMap.get(key)!;

    if (row[tradeTypeIdx]?.toLowerCase().includes("buy")) {
      group.buys.push(row);
    } else {
      group.sells.push(row);
    }
  });

  const trades: ParsedTrade[] = [];

  tradeMap.forEach((group, key) => {
    const [symbol] = key.split("-");
    const segment = group.buys[0]?.[segmentIdx] || group.sells[0]?.[segmentIdx] || "";

    const calcAvg = (rows: string[][]) => {
      let totalQty = 0;
      let totalValue = 0;
      rows.forEach((r) => {
        const qty = parseFloat(r[qtyIdx]) || 0;
        const price = parseFloat(r[priceIdx]) || 0;
        totalQty += qty;
        totalValue += qty * price;
      });
      return { qty: totalQty, avgPrice: totalQty > 0 ? totalValue / totalQty : 0 };
    };

    const buyData = calcAvg(group.buys);
    const sellData = calcAvg(group.sells);
    const qty = Math.min(buyData.qty, sellData.qty);

    if (qty === 0) return;

    const entryPrice = buyData.avgPrice;
    const exitPrice = sellData.avgPrice;
    const pnl = (exitPrice - entryPrice) * qty;
    const dateStr = group.buys[0]?.[dateIdx] || group.sells[0]?.[dateIdx];

    trades.push({
      date: new Date(dateStr),
      time: "09:15",
      symbol,
      instrument: inferInstrument(symbol, segment),
      sector: inferSector(symbol),
      side: "BUY",
      quantity: qty,
      entryPrice,
      exitPrice,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: entryPrice > 0 ? Math.round(((exitPrice - entryPrice) / entryPrice) * 10000) / 100 : 0,
      strategy: "Imported",
      holdingTime: "Intraday",
      brokerage: 20,
      notes: "Imported from Groww",
      broker: "Groww",
    });
  });

  return trades;
}

// ========================================
// UPSTOX PARSER
// ========================================
function parseUpstox(csvText: string): ParsedTrade[] {
  const rows = parseCSVRows(csvText);
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const dataRows = rows.slice(1);

  const colIdx = (name: string) =>
    headers.findIndex((h) => h.includes(name));

  const symbolIdx = colIdx("scrip") !== -1 ? colIdx("scrip") : colIdx("symbol");
  const dateIdx = colIdx("date");
  const tradeTypeIdx = colIdx("trade_type") !== -1 ? colIdx("trade_type") : colIdx("type");
  const qtyIdx = colIdx("quantity") !== -1 ? colIdx("quantity") : colIdx("qty");
  const priceIdx = colIdx("avg") !== -1 ? colIdx("avg") : colIdx("price");

  const tradeMap = new Map<string, { buys: typeof dataRows; sells: typeof dataRows }>();

  dataRows.forEach((row) => {
    if (row.length <= symbolIdx) return;
    const symbol = row[symbolIdx];
    const date = row[dateIdx];
    const key = `${symbol}-${date}`;

    if (!tradeMap.has(key)) tradeMap.set(key, { buys: [], sells: [] });
    const group = tradeMap.get(key)!;

    if (row[tradeTypeIdx]?.toLowerCase().includes("buy")) {
      group.buys.push(row);
    } else {
      group.sells.push(row);
    }
  });

  const trades: ParsedTrade[] = [];

  tradeMap.forEach((group, key) => {
    const [symbol] = key.split("-");

    const calcAvg = (rows: string[][]) => {
      let totalQty = 0;
      let totalValue = 0;
      rows.forEach((r) => {
        const qty = parseFloat(r[qtyIdx]) || 0;
        const price = parseFloat(r[priceIdx]) || 0;
        totalQty += qty;
        totalValue += qty * price;
      });
      return { qty: totalQty, avgPrice: totalQty > 0 ? totalValue / totalQty : 0 };
    };

    const buyData = calcAvg(group.buys);
    const sellData = calcAvg(group.sells);
    const qty = Math.min(buyData.qty, sellData.qty);

    if (qty === 0) return;

    const entryPrice = buyData.avgPrice;
    const exitPrice = sellData.avgPrice;
    const pnl = (exitPrice - entryPrice) * qty;
    const dateStr = group.buys[0]?.[dateIdx] || group.sells[0]?.[dateIdx];

    trades.push({
      date: new Date(dateStr),
      time: "09:15",
      symbol,
      instrument: inferInstrument(symbol),
      sector: inferSector(symbol),
      side: "BUY",
      quantity: qty,
      entryPrice,
      exitPrice,
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: entryPrice > 0 ? Math.round(((exitPrice - entryPrice) / entryPrice) * 10000) / 100 : 0,
      strategy: "Imported",
      holdingTime: "Intraday",
      brokerage: 20,
      notes: "Imported from Upstox",
      broker: "Upstox",
    });
  });

  return trades;
}

// ========================================
// GENERIC / FALLBACK PARSER
// ========================================
function parseGeneric(csvText: string, brokerName = "Unknown"): ParsedTrade[] {
  const rows = parseCSVRows(csvText);
  const headers = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const dataRows = rows.slice(1);

  const colIdx = (name: string) =>
    headers.findIndex((h) => h.includes(name));

  const symbolIdx = colIdx("symbol");
  const dateIdx = colIdx("date");
  const sideIdx = colIdx("side") !== -1 ? colIdx("side") : colIdx("type");
  const qtyIdx = colIdx("quantity") !== -1 ? colIdx("quantity") : colIdx("qty");
  const entryIdx = colIdx("entry");
  const exitIdx = colIdx("exit");
  const priceIdx = colIdx("price");
  const pnlIdx = colIdx("pnl") !== -1 ? colIdx("pnl") : colIdx("profit");

  return dataRows
    .filter((row) => row.length > symbolIdx && row[symbolIdx])
    .map((row) => {
      const symbol = row[symbolIdx] || "UNKNOWN";
      const entryPrice = parseFloat(row[entryIdx] || row[priceIdx] || "0") || 0;
      const exitPrice = parseFloat(row[exitIdx] || "0") || entryPrice;
      const qty = parseInt(row[qtyIdx] || "1") || 1;
      const pnl = pnlIdx !== -1 ? parseFloat(row[pnlIdx] || "0") : (exitPrice - entryPrice) * qty;

      return {
        date: new Date(row[dateIdx] || new Date().toISOString()),
        time: "09:15",
        symbol,
        instrument: inferInstrument(symbol),
        sector: inferSector(symbol),
        side: (row[sideIdx]?.toUpperCase().includes("BUY") ? "BUY" : "SELL") as "BUY" | "SELL",
        quantity: qty,
        entryPrice,
        exitPrice,
        pnl: Math.round(pnl * 100) / 100,
        pnlPercent: entryPrice > 0 ? Math.round(((exitPrice - entryPrice) / entryPrice) * 10000) / 100 : 0,
        strategy: "Imported",
        holdingTime: "Unknown",
        brokerage: 20,
        notes: `Imported from ${brokerName}`,
        broker: brokerName,
      };
    });
}

// ========================================
// MAIN PARSER
// ========================================
export function parseTradesCSV(csvText: string, brokerHint?: string): {
  trades: ParsedTrade[];
  broker: string;
  errors: string[];
} {
  const errors: string[] = [];

  // Detect broker
  const broker = brokerHint || detectBroker(csvText) || "Generic";

  let trades: ParsedTrade[] = [];

  try {
    switch (broker) {
      case "Zerodha":
        trades = parseZerodha(csvText);
        break;
      case "Groww":
        trades = parseGroww(csvText);
        break;
      case "Upstox":
        trades = parseUpstox(csvText);
        break;
      default:
        trades = parseGeneric(csvText, broker);
        break;
    }
  } catch (e) {
    errors.push(`Failed to parse CSV: ${e instanceof Error ? e.message : "Unknown error"}`);
  }

  // Validate trades
  trades = trades.filter((t) => {
    if (isNaN(t.date.getTime())) {
      errors.push(`Invalid date for trade: ${t.symbol}`);
      return false;
    }
    if (t.quantity <= 0) {
      errors.push(`Invalid quantity for trade: ${t.symbol}`);
      return false;
    }
    return true;
  });

  return { trades, broker, errors };
}
