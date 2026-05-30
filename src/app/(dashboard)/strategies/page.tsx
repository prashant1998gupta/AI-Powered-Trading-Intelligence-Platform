import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import StrategiesClient from "@/components/strategies/StrategiesClient";

export default async function StrategiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const trades = await db.trade.findMany({
    where: { userId: session.user.id },
  });

  const serializedTrades = JSON.parse(JSON.stringify(trades));

  return <StrategiesClient trades={serializedTrades} />;
}
