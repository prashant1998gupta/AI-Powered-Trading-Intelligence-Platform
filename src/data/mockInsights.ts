export interface AIInsight {
  id: string;
  type: "warning" | "success" | "info" | "danger";
  category: "behavior" | "performance" | "risk" | "strategy";
  title: string;
  description: string;
  metric?: string;
  actionable: boolean;
  action?: string;
  timestamp: string;
}

export const mockInsights: AIInsight[] = [
  {
    id: "ins-001",
    type: "danger",
    category: "behavior",
    title: "Revenge Trading Detected",
    description:
      "After 3 consecutive losses on March 15, you increased position size by 180% and took 4 more losing trades. This pattern has occurred 6 times in the last quarter.",
    metric: "-₹18,450 lost to revenge trading",
    actionable: true,
    action: "Set a mandatory 30-minute break after 2 consecutive losses",
    timestamp: "2025-04-28T10:30:00",
  },
  {
    id: "ins-002",
    type: "warning",
    category: "performance",
    title: "Win Rate Drops After 1 PM",
    description:
      "Your win rate drops from 58% to 34% for trades entered after 1:00 PM. Afternoon trades account for 62% of total losses.",
    metric: "34% afternoon win rate vs 58% morning",
    actionable: true,
    action: "Consider restricting new entries after 1 PM for 2 weeks as an experiment",
    timestamp: "2025-04-27T09:00:00",
  },
  {
    id: "ins-003",
    type: "success",
    category: "strategy",
    title: "Scalping Strategy Outperforming",
    description:
      "Your scalping strategy has a 64% win rate with a 1.8:1 risk-reward ratio. It generates 42% of your total profits.",
    metric: "+₹34,200 from scalping this month",
    actionable: false,
    timestamp: "2025-04-26T08:15:00",
  },
  {
    id: "ins-004",
    type: "danger",
    category: "risk",
    title: "Position Concentration Risk",
    description:
      "78% of your capital was allocated to Banking sector stocks on March 22. A single sector downturn could result in significant portfolio damage.",
    metric: "78% sector concentration",
    actionable: true,
    action: "Limit single-sector exposure to 40% of trading capital",
    timestamp: "2025-04-25T11:45:00",
  },
  {
    id: "ins-005",
    type: "info",
    category: "performance",
    title: "Tuesday is Your Best Day",
    description:
      "Your Tuesday trades show a 67% win rate and average profit of ₹2,340 per trade. Wednesdays are your worst with 38% win rate.",
    metric: "67% win rate on Tuesdays",
    actionable: true,
    action: "Increase position size slightly on Tuesdays, reduce on Wednesdays",
    timestamp: "2025-04-24T14:00:00",
  },
  {
    id: "ins-006",
    type: "warning",
    category: "behavior",
    title: "Overtrading on Loss Days",
    description:
      "On days where your first trade is a loss, you take an average of 6.2 trades (vs 3.1 on profit days). This leads to compounding losses.",
    metric: "6.2 trades/day after first loss",
    actionable: true,
    action: "Implement a 3-trade maximum rule on days starting with a loss",
    timestamp: "2025-04-23T16:30:00",
  },
  {
    id: "ins-007",
    type: "success",
    category: "performance",
    title: "Risk-Reward Improving",
    description:
      "Your average risk-reward ratio improved from 1:0.8 to 1:1.4 over the last month. This shows better trade selection and discipline.",
    metric: "1:1.4 average risk-reward",
    actionable: false,
    timestamp: "2025-04-22T09:00:00",
  },
  {
    id: "ins-008",
    type: "danger",
    category: "risk",
    title: "Maximum Drawdown Approaching Limit",
    description:
      "Current drawdown is at 12.4% of starting capital. Your max allowed drawdown threshold is 15%. Consider reducing position sizes.",
    metric: "12.4% current drawdown",
    actionable: true,
    action: "Reduce position sizes by 50% until drawdown recovers below 8%",
    timestamp: "2025-04-21T10:00:00",
  },
  {
    id: "ins-009",
    type: "info",
    category: "strategy",
    title: "Options Trading Analysis",
    description:
      "62% of your losses came from BankNifty options. Win rate for option buying is 31% vs 54% for option selling strategies.",
    metric: "31% option buying win rate",
    actionable: true,
    action: "Shift focus from option buying to option selling or spreads",
    timestamp: "2025-04-20T12:00:00",
  },
  {
    id: "ins-010",
    type: "warning",
    category: "behavior",
    title: "Late Entry Pattern",
    description:
      "23% of your trades are entered after the initial move has already happened. These late entries have a 28% win rate compared to 55% overall.",
    metric: "28% win rate on late entries",
    actionable: true,
    action: "Wait for pullbacks instead of chasing momentum",
    timestamp: "2025-04-19T09:30:00",
  },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const mockChatHistory: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Why am I losing money?",
    timestamp: "2025-04-28T10:00:00",
  },
  {
    id: "msg-2",
    role: "assistant",
    content: `Based on your trading data from the last 3 months, here are the key reasons for your losses:

**1. BankNifty Options (62% of losses)**
Your option buying trades have a 31% win rate. Most losses come from buying far OTM options that expire worthless.

**2. Afternoon Trading (Win rate drops to 34%)**
Trades entered after 1 PM show significantly worse performance. Morning trades (9:15-12:00) have a 58% win rate.

**3. Position Sizing After Losses**
After consecutive losses, your average position size increases by 180%. This revenge trading pattern has cost you ₹18,450 in the last quarter.

**4. Risk-Reward Imbalance**
Your average loss (₹2,800) is 2.4x larger than your average gain (₹1,150). You're cutting winners too early and holding losers too long.

**Recommendation:** Focus on morning scalping with strict position sizing rules. Set a daily loss limit of ₹5,000 and stop trading for the day when hit.`,
    timestamp: "2025-04-28T10:00:05",
  },
  {
    id: "msg-3",
    role: "user",
    content: "What's my best performing strategy?",
    timestamp: "2025-04-28T10:05:00",
  },
  {
    id: "msg-4",
    role: "assistant",
    content: `Your **Scalping strategy** is clearly your strongest performer:

| Metric | Scalping | Intraday | Swing | Positional |
|--------|----------|----------|-------|------------|
| Win Rate | 64% | 48% | 52% | 45% |
| Profit Factor | 1.8 | 0.9 | 1.2 | 0.8 |
| Avg R:R | 1:1.4 | 1:0.7 | 1:1.1 | 1:0.6 |
| Total P&L | +₹34,200 | -₹8,100 | +₹12,400 | -₹15,600 |

**Key Insights:**
- Scalping generates 42% of your total profits
- Your holding time for winning scalps averages 4-7 minutes
- Best symbols for scalping: HDFCBANK, SBIN, RELIANCE
- Avoid positional trades — your overnight risk management needs improvement

Would you like me to analyze which specific scalping setups work best?`,
    timestamp: "2025-04-28T10:05:05",
  },
];

export const quickPrompts = [
  "Why am I losing money?",
  "What's my best strategy?",
  "Show my risk analysis",
  "Which stocks should I avoid?",
  "When do I trade best?",
  "Analyze my position sizing",
  "Compare my weekly performance",
  "What patterns am I repeating?",
];
