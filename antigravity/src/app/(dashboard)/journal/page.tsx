"use client";

import { useState, useMemo } from "react";
import { mockTrades } from "@/data/mockTrades";
import { cn, formatCurrencyFull, formatDate } from "@/lib/utils";
import {
  Upload,
  Search,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Check,
  ArrowUpDown,
} from "lucide-react";

type SortField = "date" | "symbol" | "pnl" | "quantity";
type SortDir = "asc" | "desc";

export default function JournalPage() {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("all");
  const [selectedInstrument, setSelectedInstrument] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const perPage = 20;

  const filteredTrades = useMemo(() => {
    let trades = [...mockTrades];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      trades = trades.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    if (selectedStrategy !== "all") {
      trades = trades.filter((t) => t.strategy === selectedStrategy);
    }
    if (selectedInstrument !== "all") {
      trades = trades.filter((t) => t.instrument === selectedInstrument);
    }

    trades.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "date":
          return (`${a.date}${a.time}` > `${b.date}${b.time}` ? 1 : -1) * dir;
        case "symbol":
          return a.symbol.localeCompare(b.symbol) * dir;
        case "pnl":
          return (a.pnl - b.pnl) * dir;
        case "quantity":
          return (a.quantity - b.quantity) * dir;
        default:
          return 0;
      }
    });

    return trades;
  }, [searchQuery, selectedStrategy, selectedInstrument, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTrades.length / perPage);
  const paginatedTrades = filteredTrades.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalPnL = filteredTrades.reduce((sum, t) => sum + t.pnl, 0);
  const winCount = filteredTrades.filter((t) => t.pnl > 0).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-ag-text-muted" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-ag-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-ag-primary" />
    );
  };

  const brokers = [
    { name: "Groww", color: "from-green-500 to-emerald-600" },
    { name: "Zerodha", color: "from-blue-600 to-indigo-600" },
    { name: "Upstox", color: "from-purple-500 to-violet-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ag-text-primary">
          Trade Journal
        </h1>
        <p className="text-sm text-ag-text-secondary mt-1">
          Import, review, and analyze every trade
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          "glass-card p-8 border-2 border-dashed transition-all duration-300",
          isDragging
            ? "border-ag-primary bg-ag-primary/5"
            : "border-ag-border hover:border-ag-border-hover"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-ag-glow mx-auto mb-4 flex items-center justify-center">
            <Upload className="w-8 h-8 text-ag-primary" />
          </div>
          <h3 className="text-lg font-semibold text-ag-text-primary mb-2">
            Import Trades
          </h3>
          <p className="text-sm text-ag-text-secondary mb-6">
            Drag & drop your CSV file, or select your broker below
          </p>

          {/* Broker Selection */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {brokers.map((broker) => (
              <button
                key={broker.name}
                onClick={() =>
                  setSelectedBroker(
                    selectedBroker === broker.name ? null : broker.name
                  )
                }
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300",
                  selectedBroker === broker.name
                    ? "border-ag-primary bg-ag-primary/5"
                    : "border-ag-border hover:border-ag-border-hover bg-ag-bg-elevated/50"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", broker.color)}>
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-ag-text-primary">
                  {broker.name}
                </span>
                {selectedBroker === broker.name && (
                  <Check className="w-4 h-4 text-ag-primary" />
                )}
              </button>
            ))}
          </div>

          {selectedBroker && (
            <button className="btn-primary text-sm mt-2">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload {selectedBroker} CSV
            </button>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-ag-text-muted">Total Trades</span>
              <p className="text-lg font-bold number-display text-ag-text-primary">
                {filteredTrades.length}
              </p>
            </div>
            <div className="w-px h-8 bg-ag-border" />
            <div>
              <span className="text-xs text-ag-text-muted">Net P&L</span>
              <p className={cn("text-lg font-bold number-display", totalPnL >= 0 ? "text-ag-profit" : "text-ag-loss")}>
                {formatCurrencyFull(totalPnL)}
              </p>
            </div>
            <div className="w-px h-8 bg-ag-border" />
            <div>
              <span className="text-xs text-ag-text-muted">Win Rate</span>
              <p className="text-lg font-bold number-display text-ag-accent">
                {filteredTrades.length > 0
                  ? ((winCount / filteredTrades.length) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-ag-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="input-dark text-sm !pl-10 !py-2 w-48"
              />
            </div>
            <select
              value={selectedStrategy}
              onChange={(e) => { setSelectedStrategy(e.target.value); setPage(1); }}
              className="input-dark text-sm !py-2"
            >
              <option value="all">All Strategies</option>
              <option value="Scalping">Scalping</option>
              <option value="Intraday">Intraday</option>
              <option value="Swing">Swing</option>
              <option value="Positional">Positional</option>
            </select>
            <select
              value={selectedInstrument}
              onChange={(e) => { setSelectedInstrument(e.target.value); setPage(1); }}
              className="input-dark text-sm !py-2"
            >
              <option value="all">All Instruments</option>
              <option value="Stocks">Stocks</option>
              <option value="Options">Options</option>
              <option value="Futures">Futures</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ag-text-muted text-xs border-b border-ag-border bg-ag-bg-elevated/30">
                <th className="text-left py-3 px-4 font-medium">
                  <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-ag-text-primary">
                    Date <SortIcon field="date" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Time</th>
                <th className="text-left py-3 px-4 font-medium">
                  <button onClick={() => handleSort("symbol")} className="flex items-center gap-1 hover:text-ag-text-primary">
                    Symbol <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Side</th>
                <th className="text-right py-3 px-4 font-medium">
                  <button onClick={() => handleSort("quantity")} className="flex items-center gap-1 justify-end hover:text-ag-text-primary">
                    Qty <SortIcon field="quantity" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium">Entry</th>
                <th className="text-right py-3 px-4 font-medium">Exit</th>
                <th className="text-right py-3 px-4 font-medium">
                  <button onClick={() => handleSort("pnl")} className="flex items-center gap-1 justify-end hover:text-ag-text-primary">
                    P&L <SortIcon field="pnl" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Strategy</th>
                <th className="text-left py-3 px-4 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade) => (
                <>
                  <tr
                    key={trade.id}
                    onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                    className="border-b border-ag-border/30 hover:bg-ag-bg-elevated/20 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-ag-text-secondary text-xs">
                      {formatDate(trade.date)}
                    </td>
                    <td className="py-3 px-4 text-ag-text-muted text-xs number-display">
                      {trade.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-ag-text-primary font-medium">
                        {trade.symbol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-ag-text-muted bg-ag-bg-elevated px-2 py-0.5 rounded">
                        {trade.instrument}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded",
                        trade.side === "BUY" ? "bg-ag-profit-dim text-ag-profit" : "bg-ag-loss-dim text-ag-loss"
                      )}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right number-display text-ag-text-secondary">
                      {trade.quantity}
                    </td>
                    <td className="py-3 px-4 text-right number-display text-ag-text-secondary">
                      ₹{trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right number-display text-ag-text-secondary">
                      ₹{trade.exitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn("number-display font-medium", trade.pnl >= 0 ? "text-ag-profit" : "text-ag-loss")}>
                        {formatCurrencyFull(trade.pnl)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-ag-text-muted bg-ag-bg-elevated px-2 py-0.5 rounded">
                        {trade.strategy}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-ag-text-muted number-display">
                      {trade.holdingTime}
                    </td>
                  </tr>
                  {expandedTrade === trade.id && (
                    <tr key={`${trade.id}-expanded`} className="bg-ag-bg-elevated/20">
                      <td colSpan={11} className="px-4 py-4">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-ag-text-muted">Trade ID</p>
                            <p className="text-ag-text-primary font-mono">{trade.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ag-text-muted">Broker</p>
                            <p className="text-ag-text-primary">{trade.broker}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ag-text-muted">Sector</p>
                            <p className="text-ag-text-primary">{trade.sector}</p>
                          </div>
                          <div>
                            <p className="text-xs text-ag-text-muted">Brokerage</p>
                            <p className="text-ag-text-secondary number-display">₹{Math.abs(trade.brokerage).toFixed(2)}</p>
                          </div>
                          {trade.tags && (
                            <div className="col-span-4">
                              <p className="text-xs text-ag-text-muted mb-1">Tags</p>
                              <div className="flex gap-2">
                                {trade.tags.map((tag) => (
                                  <span key={tag} className="badge-info">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-ag-border">
          <p className="text-xs text-ag-text-muted">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredTrades.length)} of {filteredTrades.length} trades
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-ag-bg-elevated text-ag-text-secondary hover:text-ag-text-primary disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
                    pageNum === page
                      ? "bg-ag-primary text-white"
                      : "bg-ag-bg-elevated text-ag-text-secondary hover:text-ag-text-primary"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-ag-bg-elevated text-ag-text-secondary hover:text-ag-text-primary disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
