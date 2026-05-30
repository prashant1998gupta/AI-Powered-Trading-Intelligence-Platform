"use client";

import { useState, useRef, useCallback } from "react";
import { cn, formatCurrencyFull } from "@/lib/utils";
import {
  Upload,
  Search,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Check,
  ArrowUpDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileUp,
} from "lucide-react";
import { Trade } from "@prisma/client";

type SortField = "date" | "symbol" | "pnl" | "quantity";
type SortDir = "asc" | "desc";

interface TradeImporterProps {
  onImportComplete: () => void;
}

function TradeImporter({ onImportComplete }: TradeImporterProps) {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const brokers = [
    { name: "Zerodha", color: "from-blue-600 to-indigo-600" },
    { name: "Groww", color: "from-green-500 to-emerald-600" },
    { name: "Upstox", color: "from-purple-500 to-violet-600" },
    { name: "Angel One", color: "from-orange-500 to-red-500" },
  ];

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setResult({
          success: false,
          message: "Please upload a CSV file.",
        });
        return;
      }

      setIsUploading(true);
      setResult(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (selectedBroker) {
          formData.append("broker", selectedBroker);
        }

        const response = await fetch("/api/trades/import", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setResult({
            success: true,
            message: `Successfully imported ${data.imported} trades from ${data.broker}!`,
            count: data.imported,
          });
          // Refresh the page data
          setTimeout(() => onImportComplete(), 1500);
        } else {
          setResult({
            success: false,
            message: data.error || "Failed to import trades.",
          });
        }
      } catch {
        setResult({
          success: false,
          message: "Network error. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [selectedBroker, onImportComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div
      className={cn(
        "glass-card p-8 border-2 border-dashed transition-all duration-300",
        isDragging
          ? "border-ag-primary bg-ag-primary/5 scale-[1.01]"
          : "border-ag-border hover:border-ag-border-hover"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-ag-glow mx-auto mb-4 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-ag-primary animate-spin" />
          ) : result?.success ? (
            <CheckCircle2 className="w-8 h-8 text-ag-profit" />
          ) : result && !result.success ? (
            <AlertCircle className="w-8 h-8 text-ag-loss" />
          ) : (
            <Upload className="w-8 h-8 text-ag-primary" />
          )}
        </div>

        {/* Status Message */}
        {result ? (
          <div className="mb-4">
            <p
              className={cn(
                "text-sm font-medium",
                result.success ? "text-ag-profit" : "text-ag-loss"
              )}
            >
              {result.message}
            </p>
            <button
              onClick={() => setResult(null)}
              className="text-xs text-ag-text-muted hover:text-ag-text-primary mt-2 underline"
            >
              Upload another file
            </button>
          </div>
        ) : isUploading ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-ag-text-primary mb-1">
              Parsing Trades...
            </h3>
            <p className="text-sm text-ag-text-secondary">
              Analyzing your CSV and saving trades to the database
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-ag-text-primary mb-2">
              Import Trades
            </h3>
            <p className="text-sm text-ag-text-secondary mb-6">
              Drag & drop your broker CSV file, or select your broker below
            </p>
          </>
        )}

        {/* Broker Selection */}
        {!isUploading && !result && (
          <>
            <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
              {brokers.map((broker) => (
                <button
                  key={broker.name}
                  onClick={() =>
                    setSelectedBroker(
                      selectedBroker === broker.name ? null : broker.name
                    )
                  }
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all duration-300",
                    selectedBroker === broker.name
                      ? "border-ag-primary bg-ag-primary/5 shadow-lg shadow-ag-primary/10"
                      : "border-ag-border hover:border-ag-border-hover bg-ag-bg-elevated/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      broker.color
                    )}
                  >
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

            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary text-sm"
            >
              <FileUp className="w-4 h-4 inline mr-2" />
              {selectedBroker
                ? `Upload ${selectedBroker} CSV`
                : "Upload CSV File"}
            </button>

            <p className="text-[11px] text-ag-text-muted mt-3">
              Supports Zerodha Tradebook, Groww Trade Report, Upstox P&L, and
              generic CSV formats. Max 5MB.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// =======================================
// JOURNAL PAGE
// =======================================
interface JournalClientProps {
  initialTrades: Trade[];
}

export default function JournalClient({ initialTrades }: JournalClientProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("all");
  const [selectedInstrument, setSelectedInstrument] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null);
  const perPage = 20;

  // Get unique strategies and instruments from real data
  const strategies = Array.from(new Set(trades.map((t) => t.strategy))).sort();
  const instruments = Array.from(new Set(trades.map((t) => t.instrument))).sort();

  const filteredTrades = (() => {
    let filtered = [...trades];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.symbol.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    if (selectedStrategy !== "all") {
      filtered = filtered.filter((t) => t.strategy === selectedStrategy);
    }
    if (selectedInstrument !== "all") {
      filtered = filtered.filter((t) => t.instrument === selectedInstrument);
    }

    filtered.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "date":
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
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

    return filtered;
  })();

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
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 text-ag-text-muted" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-ag-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-ag-primary" />
    );
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleImportComplete = () => {
    // Force page reload to fetch fresh data from DB
    window.location.reload();
  };

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
      <TradeImporter onImportComplete={handleImportComplete} />

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
              <p
                className={cn(
                  "text-lg font-bold number-display",
                  totalPnL >= 0 ? "text-ag-profit" : "text-ag-loss"
                )}
              >
                {formatCurrencyFull(totalPnL)}
              </p>
            </div>
            <div className="w-px h-8 bg-ag-border" />
            <div>
              <span className="text-xs text-ag-text-muted">Win Rate</span>
              <p className="text-lg font-bold number-display text-ag-accent">
                {filteredTrades.length > 0
                  ? ((winCount / filteredTrades.length) * 100).toFixed(1)
                  : 0}
                %
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="input-dark text-sm !pl-10 !py-2 w-48"
              />
            </div>
            <select
              value={selectedStrategy}
              onChange={(e) => {
                setSelectedStrategy(e.target.value);
                setPage(1);
              }}
              className="input-dark text-sm !py-2"
            >
              <option value="all">All Strategies</option>
              {strategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={selectedInstrument}
              onChange={(e) => {
                setSelectedInstrument(e.target.value);
                setPage(1);
              }}
              className="input-dark text-sm !py-2"
            >
              <option value="all">All Instruments</option>
              {instruments.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
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
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-ag-text-primary"
                  >
                    Date <SortIcon field="date" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Time</th>
                <th className="text-left py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort("symbol")}
                    className="flex items-center gap-1 hover:text-ag-text-primary"
                  >
                    Symbol <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Side</th>
                <th className="text-right py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort("quantity")}
                    className="flex items-center gap-1 justify-end hover:text-ag-text-primary"
                  >
                    Qty <SortIcon field="quantity" />
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium">Entry</th>
                <th className="text-right py-3 px-4 font-medium">Exit</th>
                <th className="text-right py-3 px-4 font-medium">
                  <button
                    onClick={() => handleSort("pnl")}
                    className="flex items-center gap-1 justify-end hover:text-ag-text-primary"
                  >
                    P&L <SortIcon field="pnl" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium">Strategy</th>
                <th className="text-left py-3 px-4 font-medium">Broker</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-12 text-ag-text-muted"
                  >
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No trades found</p>
                    <p className="text-xs mt-1">
                      Import a CSV file above to get started
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTrades.map((trade) => (
                  <>
                    <tr
                      key={trade.id}
                      onClick={() =>
                        setExpandedTrade(
                          expandedTrade === trade.id ? null : trade.id
                        )
                      }
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
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded",
                            trade.side === "BUY"
                              ? "bg-ag-profit-dim text-ag-profit"
                              : "bg-ag-loss-dim text-ag-loss"
                          )}
                        >
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
                        <span
                          className={cn(
                            "number-display font-medium",
                            trade.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"
                          )}
                        >
                          {formatCurrencyFull(trade.pnl)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-ag-text-muted bg-ag-bg-elevated px-2 py-0.5 rounded">
                          {trade.strategy}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-ag-text-muted">
                          {trade.broker}
                        </span>
                      </td>
                    </tr>
                    {expandedTrade === trade.id && (
                      <tr
                        key={`${trade.id}-expanded`}
                        className="bg-ag-bg-elevated/20"
                      >
                        <td colSpan={11} className="px-4 py-4">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-ag-text-muted">
                                Trade ID
                              </p>
                              <p className="text-ag-text-primary font-mono text-xs">
                                {trade.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-ag-text-muted">
                                Broker
                              </p>
                              <p className="text-ag-text-primary">
                                {trade.broker}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-ag-text-muted">
                                Sector
                              </p>
                              <p className="text-ag-text-primary">
                                {trade.sector}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-ag-text-muted">
                                Brokerage
                              </p>
                              <p className="text-ag-text-secondary number-display">
                                ₹{Math.abs(trade.brokerage).toFixed(2)}
                              </p>
                            </div>
                            {trade.notes && (
                              <div className="col-span-4">
                                <p className="text-xs text-ag-text-muted mb-1">
                                  Notes
                                </p>
                                <p className="text-sm text-ag-text-secondary">
                                  {trade.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTrades.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ag-border">
            <p className="text-xs text-ag-text-muted">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filteredTrades.length)} of{" "}
              {filteredTrades.length} trades
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-ag-bg-elevated text-ag-text-secondary hover:text-ag-text-primary disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => {
                  const pageNum =
                    Math.max(
                      1,
                      Math.min(page - 2, totalPages - 4)
                    ) + i;
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
                }
              )}
              <button
                onClick={() =>
                  setPage(Math.min(totalPages, page + 1))
                }
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-ag-bg-elevated text-ag-text-secondary hover:text-ag-text-primary disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
