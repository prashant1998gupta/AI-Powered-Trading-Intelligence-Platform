"use client";

import { mockTrades } from "@/data/mockTrades";
import { cn, formatCurrencyFull, formatDate } from "@/lib/utils";

const recentTrades = mockTrades.slice(-15).reverse();

export default function RecentTradesTable() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ag-text-primary">
          Recent Trades
        </h3>
        <a
          href="/journal"
          className="text-xs text-ag-primary hover:text-ag-accent transition-colors"
        >
          View All →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ag-text-muted text-xs border-b border-ag-border">
              <th className="text-left py-2 pr-4 font-medium">Date</th>
              <th className="text-left py-2 pr-4 font-medium">Symbol</th>
              <th className="text-left py-2 pr-4 font-medium">Side</th>
              <th className="text-right py-2 pr-4 font-medium">Qty</th>
              <th className="text-right py-2 pr-4 font-medium">Entry</th>
              <th className="text-right py-2 pr-4 font-medium">Exit</th>
              <th className="text-right py-2 pr-4 font-medium">P&L</th>
              <th className="text-left py-2 font-medium">Strategy</th>
            </tr>
          </thead>
          <tbody>
            {recentTrades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-ag-border/50 hover:bg-ag-bg-elevated/30 transition-colors"
              >
                <td className="py-2.5 pr-4 text-ag-text-secondary text-xs">
                  {formatDate(trade.date)}
                </td>
                <td className="py-2.5 pr-4">
                  <span className="text-ag-text-primary font-medium">
                    {trade.symbol}
                  </span>
                  <span className="text-ag-text-muted text-xs ml-1">
                    {trade.instrument === "Options" ? "OPT" : trade.instrument === "Futures" ? "FUT" : "EQ"}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
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
                <td className="py-2.5 pr-4 text-right number-display text-ag-text-secondary">
                  {trade.quantity}
                </td>
                <td className="py-2.5 pr-4 text-right number-display text-ag-text-secondary">
                  ₹{trade.entryPrice.toFixed(2)}
                </td>
                <td className="py-2.5 pr-4 text-right number-display text-ag-text-secondary">
                  ₹{trade.exitPrice.toFixed(2)}
                </td>
                <td className="py-2.5 pr-4 text-right">
                  <span
                    className={cn(
                      "number-display font-medium",
                      trade.pnl >= 0 ? "text-ag-profit" : "text-ag-loss"
                    )}
                  >
                    {formatCurrencyFull(trade.pnl)}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="text-xs text-ag-text-muted bg-ag-bg-elevated px-2 py-0.5 rounded">
                    {trade.strategy}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
