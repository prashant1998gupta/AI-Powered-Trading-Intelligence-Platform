import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AICoachClient from "@/components/ai-coach/AICoachClient";

export default async function AICoachPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch insights for the user
  const insights = await db.insight.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serializedInsights = JSON.parse(JSON.stringify(insights));

  return <AICoachClient insights={serializedInsights} />;
}
