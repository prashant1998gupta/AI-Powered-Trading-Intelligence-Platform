"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  MessageSquareText,
  Target,
  Shield,
  Play,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Trade Journal",
    href: "/journal",
    icon: BookOpen,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: Brain,
  },
  {
    label: "AI Coach",
    href: "/ai-coach",
    icon: MessageSquareText,
    badge: "AI",
  },
  {
    label: "Strategies",
    href: "/strategies",
    icon: Target,
  },
  {
    label: "Risk",
    href: "/risk",
    icon: Shield,
  },
  {
    label: "Trade Replay",
    href: "/replay",
    icon: Play,
    badge: "Soon",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 border-r border-ag-border",
        "bg-ag-bg-primary/95 backdrop-blur-xl",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-ag-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold gradient-text tracking-tight">
              TradeMind AI
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-ag-primary/10 text-ag-primary border border-ag-primary/20"
                  : "text-ag-text-secondary hover:text-ag-text-primary hover:bg-ag-bg-elevated"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-ag-primary rounded-r-full" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-ag-primary" : "text-ag-text-muted group-hover:text-ag-text-secondary"
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                    item.badge === "AI"
                      ? "bg-ag-accent/15 text-ag-accent"
                      : "bg-ag-bg-elevated text-ag-text-muted"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-ag-border p-3 flex-shrink-0">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "bg-ag-bg-elevated/50"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            PG
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-ag-text-primary truncate">
                Prashant Gupta
              </p>
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-ag-warning" />
                <span className="text-xs text-ag-warning font-medium">Pro</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-ag-bg-elevated border border-ag-border flex items-center justify-center text-ag-text-muted hover:text-ag-text-primary hover:border-ag-border-hover transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
