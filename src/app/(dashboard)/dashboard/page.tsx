import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { generateAccountSummary } from "@/lib/analytics";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch data from database
  const trades = await db.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  const insights = await db.insight.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 5,
  });

  const summary = generateAccountSummary(trades);

  // Serialize Date objects for client component
  const serializedTrades = JSON.parse(JSON.stringify(trades));
  const serializedInsights = JSON.parse(JSON.stringify(insights));

  return (
    <DashboardClient
      trades={serializedTrades}
      insights={serializedInsights}
      summary={summary}
    />
  );
}
