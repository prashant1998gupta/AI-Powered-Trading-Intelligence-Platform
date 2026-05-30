import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch trades for the user
  const trades = await db.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "asc" }, // Analytics usually wants chronological order
  });

  // Serialize dates for Client Component
  const serializedTrades = JSON.parse(JSON.stringify(trades));

  return <AnalyticsClient trades={serializedTrades} />;
}
