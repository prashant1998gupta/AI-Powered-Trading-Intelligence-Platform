"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Brain,
  Shield,
  MessageSquareText,
  Target,
  ArrowRight,
  Check,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  Eye,
  Upload,
  Sparkles,
  Rocket,
  Star,
  ExternalLink,
  Globe,
  Code2,
  Mail,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Animated counter component
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    const el = document.getElementById(`counter-${end}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix]);

  return (
    <span
      id={`counter-${end}-${suffix}`}
      className="number-display"
    >
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Feature card data
const features = [
  {
    icon: BarChart3,
    title: "Smart Dashboard",
    description:
      "P&L tracking, equity curves, win rates, profit factor, drawdown analysis — all in one beautiful interface.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Behavioral Analytics",
    description:
      "Detect revenge trading, overtrading, and emotional patterns. Get scored on your trading discipline.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquareText,
    title: "AI Trading Coach",
    description:
      'Ask "Why am I losing money?" and get data-driven answers specific to your trading history.',
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Strategy Analytics",
    description:
      "Compare scalping vs swing vs intraday. Know which strategy actually makes you money.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Risk Intelligence",
    description:
      "Portfolio exposure, concentration risk, drawdown alerts, and daily risk scores.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Eye,
    title: "Trade Replay",
    description:
      "Visually replay your trades. See entries, exits, P&L, and decision flow on a timeline.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const problems = [
  {
    icon: AlertTriangle,
    title: "Data Fragmentation",
    description:
      "Your trades are scattered across Groww, Zerodha, Upstox, and Angel One. No unified view.",
    stat: "4+",
    statLabel: "Broker platforms",
  },
  {
    icon: TrendingDown,
    title: "Emotional Trading",
    description:
      "Revenge trading, overtrading, and impulsive decisions cost you money. You don't even know when it happens.",
    stat: "73%",
    statLabel: "Retail traders lose money",
  },
  {
    icon: Eye,
    title: "Zero Feedback",
    description:
      "After 100 trades, most traders still can't answer: Which setup works? Which stock loses money?",
    stat: "0",
    statLabel: "Actionable insights",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload Trades",
    description: "Import CSV from Groww, Zerodha, or Upstox. Takes under 30 seconds.",
    icon: Upload,
  },
  {
    num: "02",
    title: "Auto-Analysis",
    description: "AI categorizes positions, detects patterns, and computes 20+ metrics.",
    icon: Sparkles,
  },
  {
    num: "03",
    title: "Get Insights",
    description: "Receive personalized behavioral analysis and strategy recommendations.",
    icon: Brain,
  },
  {
    num: "04",
    title: "Improve",
    description: "Track your progress over time. Watch your win rate climb.",
    icon: Rocket,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start your trading journal",
    features: [
      "Trade Journal (50 trades/month)",
      "Basic Dashboard",
      "3 AI Insights/month",
      "1 Broker Connection",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For serious traders",
    features: [
      "Unlimited Trade Journal",
      "Advanced Dashboard & Charts",
      "Unlimited AI Coach",
      "Behavioral Analytics",
      "Strategy Analytics",
      "All Broker Connections",
      "Risk Intelligence",
      "Priority Support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Pro Plus",
    price: "₹999",
    period: "/month",
    description: "For advanced traders",
    features: [
      "Everything in Pro",
      "Strategy Backtesting",
      "Market Scanner",
      "Advanced Risk Engine",
      "Trade Replay",
      "Custom Alerts",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Start Pro Plus Trial",
    popular: false,
  },
  {
    name: "Team",
    price: "₹2,999",
    period: "/month",
    description: "For trading groups",
    features: [
      "Everything in Pro Plus",
      "Up to 10 Members",
      "Shared Analytics",
      "Group Performance Tracking",
      "Admin Dashboard",
      "Team Leaderboard",
      "Custom Branding",
      "SLA Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Options Trader, Mumbai",
    content:
      "Antigravity showed me I was losing 62% of my money on afternoon trades. I stopped trading after 1 PM and my win rate jumped from 38% to 56% in just 3 weeks.",
    avatar: "AM",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    role: "Swing Trader, Bangalore",
    content:
      "The AI Coach told me my position sizing was all wrong. After following its advice, my drawdowns reduced by 40% and I finally became consistently profitable.",
    avatar: "SR",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Scalper, Delhi",
    content:
      "I was a revenge trader and didn't even know it. Antigravity detected this pattern and saved me from blowing up my account. This tool is a game-changer.",
    avatar: "VS",
    rating: 5,
  },
];

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ag-bg-primary overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ag-border/50 bg-ag-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Antigravity</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-ag-text-secondary">
            <a href="#features" className="hover:text-ag-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-ag-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-ag-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-ag-text-secondary hover:text-ag-text-primary transition-colors"
            >
              Login
            </Link>
            <Link href="/dashboard" className="btn-accent text-sm !py-2 !px-4">
              Start Free <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-ag-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ag-accent/5 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ag-bg-elevated/60 border border-ag-border mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-ag-accent" />
              <span className="text-sm text-ag-text-secondary">
                AI-Powered Trading Intelligence
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
              <span className="text-ag-text-primary">Stop Guessing.</span>
              <br />
              <span className="bg-gradient-to-r from-ag-primary via-ag-accent to-ag-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
                Start Understanding.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-ag-text-secondary max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
              Most traders lose money because they don&apos;t understand their own behavior.
              Antigravity is your AI trading coach — analyzing patterns, detecting
              mistakes, and improving your decision quality.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animate-delay-300">
              <Link
                href="/dashboard"
                className="btn-accent text-lg !px-8 !py-4 flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Free — No Credit Card
              </Link>
              <Link
                href="/dashboard"
                className="btn-secondary text-lg !px-8 !py-4 flex items-center gap-2"
              >
                See Live Demo
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-slide-up animate-delay-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-ag-text-primary">
                  <AnimatedCounter end={2400} suffix="+" />
                </div>
                <p className="text-sm text-ag-text-muted mt-1">Active Traders</p>
              </div>
              <div className="w-px h-8 bg-ag-border hidden md:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-ag-text-primary">
                  <AnimatedCounter end={150000} suffix="+" />
                </div>
                <p className="text-sm text-ag-text-muted mt-1">Trades Analyzed</p>
              </div>
              <div className="w-px h-8 bg-ag-border hidden md:block" />
              <div className="text-center">
                <div className="text-3xl font-bold text-ag-profit">
                  <AnimatedCounter end={31} suffix="%" prefix="+" />
                </div>
                <p className="text-sm text-ag-text-muted mt-1">Avg. Performance Improvement</p>
              </div>
            </div>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-slide-up animate-delay-700">
            <div className="absolute -inset-4 bg-gradient-to-r from-ag-primary/20 via-ag-accent/20 to-ag-primary/20 rounded-2xl blur-xl" />
            <div className="relative glass-card p-6 rounded-2xl">
              {/* Mock dashboard preview */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Total P&L", value: "+₹47,850", color: "text-ag-profit", trend: "+12.4%" },
                  { label: "Win Rate", value: "52.4%", color: "text-ag-accent", trend: "+3.2%" },
                  { label: "Profit Factor", value: "1.34", color: "text-ag-primary", trend: "+0.18" },
                  { label: "Max Drawdown", value: "-12.48%", color: "text-ag-loss", trend: "-2.1%" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-ag-bg-elevated/50 rounded-lg p-4 border border-ag-border/50">
                    <p className="text-xs text-ag-text-muted mb-1">{kpi.label}</p>
                    <p className={cn("text-xl font-bold number-display", kpi.color)}>{kpi.value}</p>
                    <p className={cn("text-xs mt-1", kpi.color.includes("loss") ? "text-ag-loss" : "text-ag-profit")}>
                      {kpi.trend}
                    </p>
                  </div>
                ))}
              </div>
              {/* Mock equity curve */}
              <div className="bg-ag-bg-elevated/50 rounded-lg p-4 border border-ag-border/50 h-48 flex items-end">
                <svg viewBox="0 0 600 150" className="w-full h-full">
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,120 Q50,110 100,100 T200,80 T300,60 T400,70 T500,40 T600,30"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="animate-draw-line"
                    strokeDasharray="1000"
                  />
                  <path
                    d="M0,120 Q50,110 100,100 T200,80 T300,60 T400,70 T500,40 T600,30 V150 H0 Z"
                    fill="url(#equityGrad)"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROBLEM SECTION ========== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              The Problem With Trading Today
            </h2>
            <p className="section-subtitle mx-auto">
              90% of retail traders lose money. Not because of bad indicators —
              because of bad self-awareness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, i) => {
              const Icon = problem.icon;
              return (
                <div
                  key={problem.title}
                  className="glass-card-hover p-8 text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-ag-loss-dim flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-7 h-7 text-ag-loss" />
                  </div>
                  <div className="text-4xl font-bold text-ag-text-primary number-display mb-2">
                    {problem.stat}
                  </div>
                  <p className="text-sm text-ag-text-muted mb-4">
                    {problem.statLabel}
                  </p>
                  <h3 className="text-xl font-bold text-ag-text-primary mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-ag-text-secondary text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 dot-bg opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ag-glow border border-ag-primary/20 mb-4">
              <Sparkles className="w-3 h-3 text-ag-primary" />
              <span className="text-xs text-ag-primary font-semibold">
                POWERFUL FEATURES
              </span>
            </div>
            <h2 className="section-title mb-4">
              Everything You Need to Trade Smarter
            </h2>
            <p className="section-subtitle mx-auto">
              From basic journaling to advanced AI analysis — Antigravity covers
              your entire trading improvement journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card-hover p-8 group"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
                      feature.gradient
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-ag-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-ag-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="section-subtitle mx-auto">
              From upload to insight in under 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-ag-primary/50 via-ag-accent/50 to-ag-primary/50" />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative text-center">
                  <div className="relative z-10 w-24 h-24 rounded-full bg-ag-bg-secondary border-2 border-ag-border mx-auto mb-6 flex items-center justify-center group hover:border-ag-primary transition-colors duration-300">
                    <Icon className="w-10 h-10 text-ag-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ag-primary text-white text-sm font-bold flex items-center justify-center">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-ag-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ag-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ag-bg-secondary/30 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="section-title mb-16">Traders Love Antigravity</h2>

          <div className="relative">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className={cn(
                  "transition-all duration-500",
                  i === activeTestimonial
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                )}
              >
                <div className="glass-card p-10">
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 text-ag-warning fill-ag-warning"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-ag-text-primary leading-relaxed mb-8 italic">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center text-sm font-bold text-white">
                      {t.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-ag-text-primary">
                        {t.name}
                      </p>
                      <p className="text-sm text-ag-text-secondary">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activeTestimonial
                    ? "bg-ag-primary w-6"
                    : "bg-ag-text-muted hover:bg-ag-text-secondary"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="section-subtitle mx-auto">
              Start free. Upgrade when you&apos;re ready to unlock the full power
              of AI-driven trading intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-xl p-8 border transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-b from-ag-primary/10 to-ag-bg-secondary border-ag-primary/30 shadow-glow-blue"
                    : "glass-card-hover"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ag-primary text-white text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-ag-text-primary mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-ag-text-secondary mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold number-display text-ag-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-ag-text-muted text-sm">
                    {plan.period}
                  </span>
                </div>

                <button
                  className={cn(
                    "w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 mb-8",
                    plan.popular ? "btn-accent" : "btn-secondary"
                  )}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-ag-text-secondary"
                    >
                      <Check className="w-4 h-4 text-ag-profit flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-ag-primary/5 via-ag-accent/5 to-ag-primary/5" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="glass-card p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ag-text-primary mb-4">
              Ready to Trade{" "}
              <span className="gradient-text">Smarter</span>?
            </h2>
            <p className="text-ag-text-secondary mb-8 max-w-lg mx-auto">
              Join 2,400+ Indian traders who are already using AI to understand
              their behavior and improve performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-dark w-full sm:w-80"
              />
              <Link href="/dashboard" className="btn-accent whitespace-nowrap flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-ag-text-muted mt-4">
              Free forever plan available. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-ag-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ag-primary to-ag-accent flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">
                  Antigravity
                </span>
              </div>
              <p className="text-sm text-ag-text-secondary leading-relaxed">
                AI-powered trading intelligence for retail traders. Understand
                your behavior. Improve your decisions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-ag-text-primary mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-ag-text-secondary">
                <li><a href="#features" className="hover:text-ag-text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-ag-text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ag-text-primary mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-ag-text-secondary">
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-ag-text-primary mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-ag-text-secondary">
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-ag-text-primary transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-ag-border">
            <p className="text-sm text-ag-text-muted">
              © 2025 Antigravity. Built by Prashant Gupta. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors">
                <ExternalLink className="w-4 h-4 text-ag-text-muted hover:text-ag-text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors">
                <Globe className="w-4 h-4 text-ag-text-muted hover:text-ag-text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors">
                <Code2 className="w-4 h-4 text-ag-text-muted hover:text-ag-text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-ag-bg-elevated transition-colors">
                <Mail className="w-4 h-4 text-ag-text-muted hover:text-ag-text-primary" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
