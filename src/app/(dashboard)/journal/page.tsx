import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import JournalClient from "@/components/journal/JournalClient";

export default async function JournalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all trades for this user
  const trades = await db.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  // Serialize Date objects for client component
  const serializedTrades = JSON.parse(JSON.stringify(trades));

  return <JournalClient initialTrades={serializedTrades} />;
}
