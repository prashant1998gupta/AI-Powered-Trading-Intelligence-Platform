"use client";

import { Insight } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  ChevronRight,
} from "lucide-react";

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  danger: XCircle,
};

const colorMap = {
  warning: "text-ag-warning bg-ag-warning-dim border-ag-warning/20",
  success: "text-ag-profit bg-ag-profit-dim border-ag-profit/20",
  info: "text-ag-primary bg-ag-glow border-ag-primary/20",
  danger: "text-ag-loss bg-ag-loss-dim border-ag-loss/20",
};

interface AIInsightsPanelProps {
  insights: Insight[];
}

export default function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const displayInsights = insights.slice(0, 5);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ag-text-primary">
          AI Insights
        </h3>
        <a
          href="/ai-coach"
          className="text-xs text-ag-primary hover:text-ag-accent transition-colors"
        >
          View All →
        </a>
      </div>

      <div className="space-y-3">
        {displayInsights.map((insight) => {
          // Map Prisma severity to UI types
          let uiType: "danger" | "warning" | "info" | "success" = "info";
          if (insight.severity === "high") uiType = "danger";
          else if (insight.severity === "medium") uiType = "warning";
          else if (insight.severity === "low") uiType = "info";
          
          if (insight.type === "performance") uiType = "success"; // Override for good performance

          const Icon = iconMap[uiType];
          const colors = colorMap[uiType];

          return (
            <div
              key={insight.id}
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 hover:translate-x-1 cursor-pointer group",
                colors
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ag-text-primary">
                    {insight.title}
                  </p>
                  <p className="text-xs text-ag-text-secondary mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                  {insight.impact && (
                    <p className="text-xs font-medium mt-1.5 number-display">
                      {insight.impact}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-ag-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
