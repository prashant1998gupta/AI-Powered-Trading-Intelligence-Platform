"use client";

import { Play, Lock, Sparkles } from "lucide-react";

export default function ReplayPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ag-text-primary">
          Trade Replay
        </h1>
        <p className="text-sm text-ag-text-secondary mt-1">
          Visually replay your trades and analyze decision flow
        </p>
      </div>

      <div className="glass-card p-16 text-center">
        <div className="w-24 h-24 rounded-full bg-ag-bg-elevated mx-auto mb-8 flex items-center justify-center relative">
          <Play className="w-12 h-12 text-ag-text-muted" />
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-ag-primary flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-ag-text-primary mb-3">
          Coming Soon
        </h2>
        <p className="text-ag-text-secondary max-w-md mx-auto mb-8">
          Trade Replay will let you visually step through your trades on a timeline,
          seeing entries, exits, P&L progression, and decision flow — helping you
          learn from every trade.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-ag-text-muted">
          {[
            "Visual Timeline",
            "Entry/Exit Markers",
            "P&L Progression",
            "Decision Analysis",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ag-accent" />
              {feature}
            </div>
          ))}
        </div>

        <button className="btn-secondary mt-8">
          Notify Me When Available
        </button>
      </div>
    </div>
  );
}
