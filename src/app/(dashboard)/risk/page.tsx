import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import RiskClient from "@/components/risk/RiskClient";

export default async function RiskPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch trades
  const trades = await db.trade.findMany({
    where: { userId: session.user.id },
  });

  // Fetch insights
  const insights = await db.insight.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedTrades = JSON.parse(JSON.stringify(trades));
  const serializedInsights = JSON.parse(JSON.stringify(insights));

  return <RiskClient trades={serializedTrades} insights={serializedInsights} />;
}
