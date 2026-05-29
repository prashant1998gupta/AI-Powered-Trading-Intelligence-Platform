# Antigravity — AI-Powered Trading Intelligence Platform

## Phase 1: Frontend Foundation (Landing Page + Dashboard + Trade Journal)

Build a stunning, production-quality frontend with mock data to establish the visual foundation, design system, and core user flows.

---

## Tech Stack (Phase 1)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | v3 |
| Components | ShadCN UI | latest |
| Charts | Recharts | 2.x |
| Icons | Lucide React | latest |
| Fonts | Inter (Google Fonts) | - |

---

## User Review Required

> [!IMPORTANT]
> **Design Direction**: The plan uses a dark-theme-first approach with a deep navy/charcoal base, electric blue/cyan accents, and green/red for profit/loss. This matches the premium "Bloomberg Terminal for retail traders" vision. Please confirm this is the desired aesthetic.

> [!IMPORTANT]
> **Mock Data Approach**: Phase 1 will use realistic Indian market mock data (BankNifty, Nifty, Reliance, TCS, etc.) with ₹ (INR) currency formatting throughout. No backend will be connected yet — all data is static/generated client-side.

> [!IMPORTANT]
> **Scope**: This plan covers the **frontend only**. Backend (NestJS + PostgreSQL + Supabase), AI layer (OpenAI/Claude), and broker integrations will be separate phases.

---

## Open Questions

> [!NOTE]
> 1. **Authentication UI**: Should we build login/signup pages in Phase 1 (UI only, no backend), or defer to Phase 2?
> 2. **Mobile Responsiveness**: Should the dashboard be fully responsive from Day 1, or is desktop-first acceptable for Phase 1?
> 3. **Logo/Branding**: Do you have an existing logo for Antigravity, or should we design placeholder branding?

---

## Proposed Changes

### 1. Project Scaffold

#### [NEW] Project initialization via `create-next-app`

- Initialize Next.js 14 with App Router, TypeScript, TailwindCSS v3, ESLint
- Configure `tailwind.config.ts` with custom Antigravity design tokens (colors, fonts, spacing)
- Install dependencies: `recharts`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
- Initialize ShadCN UI with `shadcn-ui init`

---

### 2. Design System & Global Styles

#### [NEW] `tailwind.config.ts`
Custom theme extension with:
- **Colors**: `ag-primary` (electric blue), `ag-accent` (cyan), `ag-profit` (emerald green), `ag-loss` (rose red), `ag-bg` (deep charcoal/navy gradients), `ag-surface` (elevated card backgrounds), `ag-muted` (gray tones)
- **Fonts**: Inter as primary, JetBrains Mono for numbers/code
- **Animations**: `fadeIn`, `slideUp`, `pulse-glow`, `shimmer`
- **Shadows**: `glow-blue`, `glow-green`, `glow-red` for accent effects

#### [NEW] `src/app/globals.css`
- CSS custom properties for theming
- Glassmorphism utility classes
- Custom scrollbar styling
- Chart styling overrides

#### [NEW] `src/lib/utils.ts`
- `cn()` utility (clsx + tailwind-merge)
- Currency formatter (₹ INR)
- Number formatters (percentage, compact numbers)
- Date formatters (IST timezone)

---

### 3. Layout & Navigation

#### [NEW] `src/app/layout.tsx`
- Root layout with dark theme, Inter font, metadata (SEO)
- Global providers wrapper

#### [NEW] `src/components/layout/Sidebar.tsx`
- Collapsible sidebar with:
  - Antigravity logo/branding at top
  - Navigation items: Dashboard, Trade Journal, Analytics, AI Coach, Strategies, Risk, Trade Replay
  - User avatar & subscription badge at bottom
  - Active state indicators with glow effect
  - Smooth collapse/expand animation

#### [NEW] `src/components/layout/TopBar.tsx`
- Account switcher dropdown
- Quick search (Cmd+K style)
- Notification bell with count badge
- Settings gear icon

#### [NEW] `src/app/(dashboard)/layout.tsx`
- Dashboard layout wrapping sidebar + topbar + content area
- Responsive container with proper spacing

---

### 4. Landing Page (Marketing)

#### [NEW] `src/app/page.tsx`
Premium marketing landing page with sections:

1. **Hero Section**: Bold tagline "Stop Guessing. Start Understanding.", animated background with subtle grid/particles, CTA buttons ("Start Free" / "See Demo"), floating dashboard preview screenshot
2. **Problem Section**: 3-column cards showing Data Fragmentation, Emotional Trading, No Feedback — with icons and micro-animations
3. **Features Section**: Alternating left-right feature showcases with mock screenshots for Dashboard, AI Coach, Behavioral Analytics, Strategy Analytics
4. **How It Works**: 4-step visual flow (Upload → Analyze → Insights → Improve) with connecting animated lines
5. **Pricing Section**: 4-tier cards (Free, Pro ₹499, Pro Plus ₹999, Team ₹2999) with feature comparison, popular badge on Pro
6. **Testimonials**: Rotating quotes from mock traders
7. **CTA Footer**: Final conversion section with email signup
8. **Footer**: Links, socials, legal

---

### 5. Dashboard Page

#### [NEW] `src/app/(dashboard)/dashboard/page.tsx`
Main analytics dashboard with:

**Row 1 — KPI Cards (4 columns)**:
- Total P&L (with trend arrow & sparkline)
- Win Rate (circular progress)
- Profit Factor (gauge meter)
- Risk-Reward Ratio (with comparison indicator)

**Row 2 — Charts (2 columns)**:
- Equity Curve (area chart with gradient fill)
- P&L Calendar Heatmap (daily P&L colored cells)

**Row 3 — Mixed (2 columns)**:
- Drawdown Chart (inverted area chart, red gradient)
- Trading Performance by Day of Week (bar chart)

**Row 4 — Tables & Lists**:
- Recent Trades table (sortable, with profit/loss coloring)
- Active Alerts / AI Insights sidebar panel

#### [NEW] `src/components/dashboard/KPICard.tsx`
Glassmorphism card with:
- Icon, label, value, trend indicator
- Sparkline mini-chart
- Hover glow effect

#### [NEW] `src/components/dashboard/EquityCurve.tsx`
Recharts AreaChart with gradient fill, tooltip, responsive container

#### [NEW] `src/components/dashboard/PLCalendarHeatmap.tsx`
Custom calendar grid showing daily P&L as colored cells (green = profit, red = loss, intensity = magnitude)

#### [NEW] `src/components/dashboard/DrawdownChart.tsx`
Inverted area chart showing drawdown periods

#### [NEW] `src/components/dashboard/DayOfWeekChart.tsx`
Bar chart comparing performance by day (Mon–Fri)

#### [NEW] `src/components/dashboard/RecentTradesTable.tsx`
Sortable table with columns: Date, Symbol, Side (Buy/Sell), Qty, Entry, Exit, P&L, Strategy

#### [NEW] `src/components/dashboard/AIInsightsPanel.tsx`
Sidebar panel showing AI-generated insights with severity icons

---

### 6. Trade Journal Page

#### [NEW] `src/app/(dashboard)/journal/page.tsx`
Trade journal with:
- **Upload Zone**: Drag-and-drop CSV upload area (Groww/Zerodha/Upstox selector)
- **Filters Bar**: Date range, instrument type, strategy, symbol search
- **Trades Table**: Full trade history with expandable rows
- **Trade Detail Modal**: Click a trade to see full details + notes

#### [NEW] `src/components/journal/CSVUploadZone.tsx`
Beautiful drag-and-drop zone with:
- Broker logo selection (Groww, Zerodha, Upstox)
- File validation UI
- Progress animation
- Success/error states

#### [NEW] `src/components/journal/TradeFilters.tsx`
Filter bar with date picker, dropdowns, search input

#### [NEW] `src/components/journal/TradesTable.tsx`
Full-featured trades table with pagination, sorting, expandable rows

#### [NEW] `src/components/journal/TradeDetailModal.tsx`
Modal dialog showing full trade details, notes editor, tags

---

### 7. Behavioral Analytics Page

#### [NEW] `src/app/(dashboard)/analytics/page.tsx`
Behavioral analytics dashboard with:
- **Behavioral Score**: Overall behavioral health gauge (0-100)
- **Pattern Detection Cards**: Revenge Trading, Overtrading, Emotional Trading — each with detection count, examples, and severity
- **Trading Session Analysis**: Heatmap of trades by hour of day vs day of week
- **Position Sizing Analysis**: Distribution chart of position sizes with outlier detection
- **Streak Analysis**: Win/loss streak visualization

#### [NEW] `src/components/analytics/BehaviorScore.tsx`
Animated gauge showing overall behavioral health

#### [NEW] `src/components/analytics/PatternCard.tsx`
Card showing detected behavioral pattern with severity, count, and examples

#### [NEW] `src/components/analytics/TradingHeatmap.tsx`
Hour × Day heatmap showing trade frequency/performance

#### [NEW] `src/components/analytics/PositionSizeDistribution.tsx`
Histogram of position sizes with normal distribution overlay

---

### 8. AI Coach Page

#### [NEW] `src/app/(dashboard)/ai-coach/page.tsx`
AI coaching interface with:
- **Chat Interface**: ChatGPT-style conversation with AI coach
- **Quick Prompts**: Suggested questions ("Why am I losing money?", "What's my best strategy?", "Show my risk analysis")
- **Insights Feed**: Pre-generated AI insights with action items
- **Performance Recommendations**: Personalized suggestion cards

#### [NEW] `src/components/ai-coach/ChatInterface.tsx`
Chat UI with message bubbles, typing indicator, and rich responses (charts embedded in messages)

#### [NEW] `src/components/ai-coach/InsightCard.tsx`
AI insight card with icon, severity, description, and action button

#### [NEW] `src/components/ai-coach/QuickPrompts.tsx`
Grid of clickable prompt suggestions

---

### 9. Strategy Analytics Page

#### [NEW] `src/app/(dashboard)/strategies/page.tsx`
Strategy performance breakdown:
- **Strategy Comparison Table**: Win rate, P&L, trade count, avg holding time per strategy
- **Strategy Performance Charts**: Side-by-side bar/radar charts
- **Instrument Breakdown**: Performance by stocks/options/futures
- **Sector Analysis**: Performance by sector (Banking, IT, Pharma, etc.)

---

### 10. Risk Intelligence Page

#### [NEW] `src/app/(dashboard)/risk/page.tsx`
Risk management dashboard:
- **Risk Score Gauge**: Overall portfolio risk (0-100)
- **Portfolio Exposure**: Treemap of position sizes
- **Concentration Risk**: Pie chart of sector/instrument allocation
- **Capital Allocation**: Waterfall chart showing capital distribution
- **Risk Alerts**: List of active risk warnings

---

### 11. Mock Data Layer

#### [NEW] `src/data/mockTrades.ts`
- 200+ realistic mock trades with Indian market symbols (RELIANCE, TCS, INFY, HDFCBANK, BANKNIFTY, NIFTY50)
- Realistic P&L distribution, dates spanning 3 months
- Multiple strategies (Scalping, Intraday, Swing, Positional)
- Multiple instruments (Stocks, Options, Futures)

#### [NEW] `src/data/mockInsights.ts`
- Pre-generated AI insights and recommendations
- Behavioral pattern detections
- Performance suggestions

#### [NEW] `src/data/mockUser.ts`
- Mock user profile with subscription info
- Account balances and metrics

#### [NEW] `src/lib/analytics.ts`
- Functions to compute metrics from mock data:
  - `calculateWinRate()`
  - `calculateProfitFactor()`
  - `calculateMaxDrawdown()`
  - `calculateEquityCurve()`
  - `detectRevengeTrading()`
  - `detectOvertrading()`
  - `calculateRiskScore()`

---

## File Structure Summary

```
src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles
│   └── (dashboard)/
│       ├── layout.tsx                # Dashboard layout (sidebar + topbar)
│       ├── dashboard/page.tsx        # Main dashboard
│       ├── journal/page.tsx          # Trade journal
│       ├── analytics/page.tsx        # Behavioral analytics
│       ├── ai-coach/page.tsx         # AI coach
│       ├── strategies/page.tsx       # Strategy analytics
│       └── risk/page.tsx             # Risk intelligence
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── EquityCurve.tsx
│   │   ├── PLCalendarHeatmap.tsx
│   │   ├── DrawdownChart.tsx
│   │   ├── DayOfWeekChart.tsx
│   │   ├── RecentTradesTable.tsx
│   │   └── AIInsightsPanel.tsx
│   ├── journal/
│   │   ├── CSVUploadZone.tsx
│   │   ├── TradeFilters.tsx
│   │   ├── TradesTable.tsx
│   │   └── TradeDetailModal.tsx
│   ├── analytics/
│   │   ├── BehaviorScore.tsx
│   │   ├── PatternCard.tsx
│   │   ├── TradingHeatmap.tsx
│   │   └── PositionSizeDistribution.tsx
│   ├── ai-coach/
│   │   ├── ChatInterface.tsx
│   │   ├── InsightCard.tsx
│   │   └── QuickPrompts.tsx
│   └── ui/                          # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── data/
│   ├── mockTrades.ts
│   ├── mockInsights.ts
│   └── mockUser.ts
└── lib/
    ├── utils.ts
    └── analytics.ts
```

---

## Design System Preview

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `ag-bg-primary` | `#0a0e1a` | Main background |
| `ag-bg-secondary` | `#111827` | Card backgrounds |
| `ag-bg-elevated` | `#1e293b` | Elevated surfaces |
| `ag-primary` | `#3b82f6` | Primary actions, links |
| `ag-accent` | `#06b6d4` | Accents, highlights |
| `ag-profit` | `#10b981` | Profit indicators |
| `ag-loss` | `#ef4444` | Loss indicators |
| `ag-warning` | `#f59e0b` | Warnings, alerts |
| `ag-text-primary` | `#f1f5f9` | Primary text |
| `ag-text-secondary` | `#94a3b8` | Secondary text |
| `ag-border` | `#1e293b` | Borders |
| `ag-glow` | `rgba(59,130,246,0.15)` | Glow effects |

### Typography
- **Headings**: Inter, 600-700 weight
- **Body**: Inter, 400 weight  
- **Numbers/Data**: JetBrains Mono, 500 weight
- **Sizes**: Standard scale from 12px to 48px

### Effects
- Glassmorphism: `backdrop-blur-xl bg-white/5 border border-white/10`
- Card hover: `translateY(-2px)` + increased shadow + border glow
- Sparkline animations: Draw-in on mount
- Number counters: Count-up animation on visibility

---

## Verification Plan

### Automated Tests
```bash
# Build verification
npm run build

# Lint check
npm run lint

# Type check
npx tsc --noEmit
```

### Manual Verification
- Run `npm run dev` and visually verify:
  1. Landing page renders with all sections, animations work
  2. Dashboard shows all KPI cards, charts render with mock data
  3. Trade journal table loads, CSV upload zone displays correctly
  4. Behavioral analytics shows pattern detection cards
  5. AI Coach chat interface is interactive
  6. Strategy analytics renders comparison charts
  7. Risk page shows gauges and treemaps
  8. Sidebar navigation works between all pages
  9. Responsive design works on tablet+ widths
  10. Dark theme is consistent across all pages

---

## Execution Order

1. **Scaffold** — Initialize Next.js project, configure TailwindCSS, install dependencies, set up ShadCN
2. **Design System** — Create `tailwind.config.ts`, `globals.css`, utility functions
3. **Layout** — Build Sidebar, TopBar, dashboard layout
4. **Mock Data** — Create all mock data files and analytics functions
5. **Landing Page** — Build the marketing page with all sections
6. **Dashboard** — Build all dashboard components and wire up mock data
7. **Trade Journal** — Build journal page with upload zone and table
8. **Behavioral Analytics** — Build analytics page with pattern detection
9. **AI Coach** — Build chat interface with pre-generated responses
10. **Strategy Analytics** — Build strategy comparison page
11. **Risk Intelligence** — Build risk dashboard
12. **Polish** — Animations, transitions, responsive refinement, SEO meta tags
