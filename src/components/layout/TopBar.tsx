"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Settings,
  Command,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { mockNotifications } from "@/data/mockUser";

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-ag-border bg-ag-bg-primary/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Account Switcher */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-ag-bg-elevated transition-colors">
          <div className="w-2 h-2 rounded-full bg-ag-profit animate-pulse" />
          <span className="text-sm font-medium text-ag-text-primary">
            Live Trading Account
          </span>
          <ChevronDown className="w-4 h-4 text-ag-text-muted" />
        </button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-ag-bg-elevated/60 border border-ag-border hover:border-ag-border-hover transition-all text-sm"
        >
          <Search className="w-4 h-4 text-ag-text-muted" />
          <span className="text-ag-text-muted flex-1 text-left">
            Search trades, symbols, insights...
          </span>
          <div className="flex items-center gap-1 text-ag-text-muted">
            <kbd className="px-1.5 py-0.5 rounded bg-ag-bg-primary text-[10px] font-mono border border-ag-border">
              <Command className="w-2.5 h-2.5 inline" />
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-ag-bg-primary text-[10px] font-mono border border-ag-border">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors group">
          <Bell className="w-5 h-5 text-ag-text-muted group-hover:text-ag-text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ag-loss text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors group">
          <Settings className="w-5 h-5 text-ag-text-muted group-hover:text-ag-text-primary transition-colors" />
        </button>

        {/* Sign Out */}
        <button 
          onClick={() => signOut()}
          className="p-2 rounded-lg hover:bg-ag-loss/20 transition-colors group ml-2 border border-transparent hover:border-ag-loss/30"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 text-ag-text-muted group-hover:text-ag-loss transition-colors" />
        </button>
      </div>
    </header>
  );
}
