"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { mockChatHistory, mockInsights, quickPrompts, type ChatMessage } from "@/data/mockInsights";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
} from "lucide-react";

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  danger: XCircle,
};

const colorMap = {
  warning: { bg: "bg-ag-warning-dim", text: "text-ag-warning", border: "border-ag-warning/20" },
  success: { bg: "bg-ag-profit-dim", text: "text-ag-profit", border: "border-ag-profit/20" },
  info: { bg: "bg-ag-glow", text: "text-ag-primary", border: "border-ag-primary/20" },
  danger: { bg: "bg-ag-loss-dim", text: "text-ag-loss", border: "border-ag-loss/20" },
};

export default function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: generateAIResponse(content.trim()),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col glass-card overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-ag-border">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-ag-text-primary flex items-center gap-2">
                AI Trading Coach
                <span className="badge-info !text-[10px]">
                  <Sparkles className="w-3 h-3 inline mr-0.5" />
                  Powered by AI
                </span>
              </h2>
              <p className="text-xs text-ag-text-muted">
                Ask me anything about your trading performance
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : ""
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl p-4 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-ag-primary text-white rounded-br-sm"
                      : "bg-ag-bg-elevated border border-ag-border text-ag-text-primary rounded-bl-sm"
                  )}
                >
                  {msg.content.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={i} className="font-bold mt-2 first:mt-0">
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("| ")) {
                      return (
                        <pre key={i} className="text-xs font-mono bg-ag-bg-primary/50 rounded px-2 py-1 mt-1 overflow-x-auto">
                          {line}
                        </pre>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return (
                        <p key={i} className="ml-4 relative before:content-['•'] before:absolute before:-left-3 before:text-ag-primary mt-1">
                          {line.slice(2)}
                        </p>
                      );
                    }
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="mt-1 first:mt-0">{line}</p>;
                  })}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-ag-bg-elevated border border-ag-border flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-ag-text-secondary" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-ag-bg-elevated border border-ag-border rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-ag-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-ag-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-ag-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-5 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-ag-bg-elevated border border-ag-border text-ag-text-secondary hover:text-ag-primary hover:border-ag-primary/30 transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-5 pb-5">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your AI coach..."
                className="input-dark flex-1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="btn-primary !px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-4 overflow-y-auto max-h-full">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-ag-warning" />
              <h3 className="text-sm font-semibold text-ag-text-primary">
                AI Insights
              </h3>
            </div>
            <div className="space-y-3">
              {mockInsights.map((insight) => {
                const Icon = iconMap[insight.type];
                const colors = colorMap[insight.type];
                return (
                  <div
                    key={insight.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all hover:translate-x-1 cursor-pointer",
                      colors.bg,
                      colors.border
                    )}
                    onClick={() => handleSend(`Tell me more about: ${insight.title}`)}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", colors.text)} />
                      <div>
                        <p className="text-xs font-semibold text-ag-text-primary">
                          {insight.title}
                        </p>
                        <p className="text-[11px] text-ag-text-secondary mt-1 line-clamp-2">
                          {insight.description}
                        </p>
                        {insight.actionable && insight.action && (
                          <p className="text-[11px] text-ag-accent mt-1.5 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {insight.action}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock AI response generator
function generateAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("losing") || q.includes("loss")) {
    return `Based on your recent trading data, here are the top 3 reasons for your losses:

**1. BankNifty Options (62% of losses)**
Your option buying trades have only a 31% win rate. Consider switching to option selling strategies or using defined-risk spreads.

**2. Position Sizing Inconsistency**
After losses, your position size increases by an average of 180%. This revenge trading pattern has cost you approximately ₹18,450.

**3. Afternoon Trading**
Your win rate drops from 58% (morning) to 34% (afternoon). Consider stopping new entries after 1 PM.

**Action Plan:**
- Set a daily loss limit of ₹5,000
- Use fixed position sizing (2% of capital per trade)
- Stop trading after 2 consecutive losses`;
  }

  if (q.includes("strategy") || q.includes("best")) {
    return `Your **Scalping strategy** is clearly your best performer:

**Performance Breakdown:**
- Scalping: 64% win rate, PF 1.8, +₹34,200
- Swing: 52% win rate, PF 1.2, +₹12,400
- Intraday: 48% win rate, PF 0.9, -₹8,100
- Positional: 45% win rate, PF 0.8, -₹15,600

**Key Insight:** Your scalping wins are concentrated in the 9:15-11:00 AM window on HDFCBANK and SBIN. Focus your capital on what's working.`;
  }

  if (q.includes("risk")) {
    return `**Risk Analysis Summary:**

Your current risk score is **62/100** (Moderate-High).

**Key Concerns:**
- Portfolio concentration: 78% in Banking sector
- Current drawdown: 12.4% (approaching 15% limit)
- Risk-reward ratio: 1:0.8 (below the recommended 1:1.5)

**Recommendations:**
- Diversify across at least 3 sectors
- Reduce position sizes by 30% until drawdown recovers
- Implement strict stop-losses at 1% of capital per trade`;
  }

  return `Great question! Let me analyze your trading data...

Based on your last 289 trades:

**Summary:**
- Win Rate: 52.4% (slightly above breakeven)
- Profit Factor: 1.34 (acceptable but room for improvement)
- Best performing symbol: HDFCBANK (+₹12,800)
- Worst performing symbol: BANKNIFTY (-₹9,400)

**Key Recommendation:**
Focus on your strengths — morning scalping on banking stocks. Your data shows this is where you have the most edge.

Would you like me to dive deeper into any specific aspect?`;
}
