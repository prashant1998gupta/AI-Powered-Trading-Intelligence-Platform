# TradeMind AI 🧠📈

**TradeMind AI** is a premium, AI-powered trading intelligence platform designed specifically for retail traders. It acts as your personal AI trading coach — helping you discover behavioral patterns, optimize strategies, and manage risk with Bloomberg-terminal-grade analytics.

## 🚀 Vision
Most retail traders lose money not because they lack indicators, but because they do not understand their own behavior. 
TradeMind AI helps traders discover:
* Why they lose
* Where they lose
* When they lose
* Which strategies work
* Which mistakes repeat

## 💡 Core Philosophy
While most trading products focus on Signals, Predictions, Bots, or Copy Trading, TradeMind AI focuses on:
- **Self-analysis**
- **Performance analytics**
- **Risk management**
- **Behavioral intelligence**

*Our Goal: Help traders dramatically improve decision quality.*

## ✨ Features
* **Bloomberg-Style Dashboard**: A premium dark-mode interface with beautiful charts (Equity Curve, P&L Heatmap, Drawdown charts).
* **Trade Journaling**: Securely log your trades and visualize them with detailed analytics.
* **Behavioral Analytics**: AI-powered detection of revenge trading, overtrading, and emotional trading patterns.
* **AI Coach**: A ChatGPT-style interface that analyzes your specific trading history and gives you personalized feedback.
* **Strategy & Risk Analytics**: Visualize which strategies are most profitable and track your portfolio exposure.

## 🛠 Tech Stack
* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: TailwindCSS v3 + ShadCN UI
* **Charts**: Recharts
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: NextAuth.js

## 🖥 Getting Started

First, ensure you have set up your `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trademind?schema=public"
NEXTAUTH_SECRET="your-secret"
```

Then, initialize your database and run the development server:

```bash
# Install dependencies
npm install

# Push the schema to your database
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 License
© 2025 TradeMind AI. Built by Prashant Gupta. All rights reserved.
