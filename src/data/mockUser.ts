export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscription: "Free" | "Pro" | "Pro Plus" | "Team";
  joinDate: string;
  totalTrades: number;
  activeSince: string;
  connectedBrokers: string[];
  capitalDeployed: number;
}

export const mockUser: UserProfile = {
  id: "usr-001",
  name: "Prashant Gupta",
  email: "prashant@trademind.ai",
  avatar: "PG",
  subscription: "Pro",
  joinDate: "2025-01-15",
  totalTrades: 847,
  activeSince: "2025-02-01",
  connectedBrokers: ["Groww", "Zerodha"],
  capitalDeployed: 500000,
};

export interface AccountSummary {
  totalPnl: number;
  totalPnlPercent: number;
  winRate: number;
  profitFactor: number;
  riskReward: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  bestTrade: number;
  worstTrade: number;
  averageTradesPerDay: number;
  sharpeRatio: number;
  longestWinStreak: number;
  longestLossStreak: number;
  currentStreak: number;
  currentStreakType: "win" | "loss";
}

export const mockAccountSummary: AccountSummary = {
  totalPnl: 47850,
  totalPnlPercent: 9.57,
  winRate: 52.4,
  profitFactor: 1.34,
  riskReward: 1.18,
  maxDrawdown: 62400,
  maxDrawdownPercent: 12.48,
  totalTrades: 289,
  winningTrades: 151,
  losingTrades: 138,
  averageWin: 2340,
  averageLoss: 1980,
  bestTrade: 18500,
  worstTrade: -12800,
  averageTradesPerDay: 3.4,
  sharpeRatio: 1.12,
  longestWinStreak: 7,
  longestLossStreak: 5,
  currentStreak: 2,
  currentStreakType: "win",
};

export interface Notification {
  id: string;
  type: "alert" | "insight" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "alert",
    title: "Daily Loss Limit Warning",
    message: "You've reached 80% of your daily loss limit (₹4,000 / ₹5,000)",
    read: false,
    timestamp: "2025-04-28T14:30:00",
  },
  {
    id: "notif-2",
    type: "insight",
    title: "New AI Insight Available",
    message: "Your revenge trading pattern was detected again today. Tap to view analysis.",
    read: false,
    timestamp: "2025-04-28T13:15:00",
  },
  {
    id: "notif-3",
    type: "system",
    title: "Trade Import Complete",
    message: "45 new trades imported from Zerodha. Dashboard updated.",
    read: true,
    timestamp: "2025-04-28T09:30:00",
  },
  {
    id: "notif-4",
    type: "alert",
    title: "Position Concentration Alert",
    message: "Banking sector exposure is at 72%. Consider diversifying.",
    read: true,
    timestamp: "2025-04-27T15:00:00",
  },
];
