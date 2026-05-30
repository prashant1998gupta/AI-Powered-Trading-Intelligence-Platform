const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// We use require here because ts-node sometimes has issues with ES modules in seed scripts
// without complex tsconfig setups. We'll use the raw mock data directly in the script for simplicity.

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Create a Test User
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      name: 'Prashant Gupta',
      email: 'test@example.com',
      hashedPassword,
      subscription: 'Pro',
    },
  });

  console.log(`Created test user: ${user.email}`);

  // 2. Clear existing trades/insights for this user to avoid duplicates if run multiple times
  await prisma.trade.deleteMany({ where: { userId: user.id } });
  await prisma.insight.deleteMany({ where: { userId: user.id } });

  // 3. Seed Trades (A sample of realistic mock trades)
  const mockTrades = [
    {
      date: new Date('2024-03-15'),
      time: '09:45',
      symbol: 'NIFTY',
      instrument: 'Options',
      sector: 'Index',
      side: 'BUY',
      quantity: 50,
      entryPrice: 22150.50,
      exitPrice: 22210.00,
      pnl: 2975.00,
      pnlPercent: 0.27,
      strategy: 'Breakout',
      holdingTime: '45m',
      brokerage: 40.00,
      notes: 'Strong momentum at open',
      broker: 'Zerodha',
    },
    {
      date: new Date('2024-03-15'),
      time: '11:20',
      symbol: 'HDFCBANK',
      instrument: 'Stocks',
      sector: 'Banking',
      side: 'SELL',
      quantity: 100,
      entryPrice: 1450.00,
      exitPrice: 1442.00,
      pnl: 800.00,
      pnlPercent: 0.55,
      strategy: 'Mean Reversion',
      holdingTime: '1h 15m',
      brokerage: 20.00,
      notes: 'Faded the morning rally',
      broker: 'Groww',
    },
    {
      date: new Date('2024-03-14'),
      time: '10:15',
      symbol: 'RELIANCE',
      instrument: 'Futures',
      sector: 'Energy',
      side: 'BUY',
      quantity: 250,
      entryPrice: 2950.00,
      exitPrice: 2940.00,
      pnl: -2500.00,
      pnlPercent: -0.34,
      strategy: 'Trend Following',
      holdingTime: '30m',
      brokerage: 40.00,
      notes: 'Stopped out. Fake breakdown.',
      broker: 'Zerodha',
    },
    {
      date: new Date('2024-03-13'),
      time: '14:30',
      symbol: 'BANKNIFTY',
      instrument: 'Options',
      sector: 'Index',
      side: 'BUY',
      quantity: 30,
      entryPrice: 47200.00,
      exitPrice: 47450.00,
      pnl: 7500.00,
      pnlPercent: 0.53,
      strategy: 'Support Bounce',
      holdingTime: '2h',
      brokerage: 40.00,
      notes: 'Perfect execution near daily support',
      broker: 'Upstox',
    },
    {
      date: new Date('2024-03-12'),
      time: '09:30',
      symbol: 'INFY',
      instrument: 'Stocks',
      sector: 'IT',
      side: 'SELL',
      quantity: 200,
      entryPrice: 1620.00,
      exitPrice: 1635.00,
      pnl: -3000.00,
      pnlPercent: -0.92,
      strategy: 'Breakdown',
      holdingTime: '15m',
      brokerage: 20.00,
      notes: 'Revenge trade. Should not have taken this.',
      broker: 'Zerodha',
    }
  ];

  console.log(`Seeding ${mockTrades.length} trades...`);
  for (const trade of mockTrades) {
    await prisma.trade.create({
      data: {
        ...trade,
        userId: user.id,
      }
    });
  }

  // 4. Seed Insights
  const mockInsights = [
    {
      type: "behavioral",
      severity: "high",
      title: "Revenge Trading Detected",
      description: "You took 3 trades within 15 minutes after a stop-loss hit on INFY.",
      impact: "-₹3,000 P&L impact this week",
      suggestion: "Set a hard rule: Take a 30-minute screen break after any loss exceeding ₹2,000.",
    },
    {
      type: "performance",
      severity: "low",
      title: "Strong Morning Performance",
      description: "Your win rate is 78% for trades taken between 9:15 AM and 10:30 AM.",
      impact: "+₹12,450 P&L contribution",
      suggestion: "Consider increasing position sizing by 25% during morning setups.",
    }
  ];

  console.log(`Seeding ${mockInsights.length} insights...`);
  for (const insight of mockInsights) {
    await prisma.insight.create({
      data: {
        ...insight,
        userId: user.id,
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
