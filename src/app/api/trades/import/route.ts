import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseTradesCSV } from "@/lib/parsers/csvParser";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const brokerHint = formData.get("broker") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Read file content
    const csvText = await file.text();

    // Parse trades
    const { trades, broker, errors } = parseTradesCSV(
      csvText,
      brokerHint || undefined
    );

    if (trades.length === 0) {
      return NextResponse.json(
        {
          error: "No valid trades found in the CSV file",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Save trades to database
    const createdTrades = await db.trade.createMany({
      data: trades.map((trade) => ({
        userId: session.user!.id!,
        date: trade.date,
        time: trade.time,
        symbol: trade.symbol,
        instrument: trade.instrument,
        sector: trade.sector,
        side: trade.side,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        pnl: trade.pnl,
        pnlPercent: trade.pnlPercent,
        strategy: trade.strategy,
        holdingTime: trade.holdingTime,
        brokerage: trade.brokerage,
        notes: trade.notes,
        broker: trade.broker,
      })),
    });

    return NextResponse.json({
      success: true,
      imported: createdTrades.count,
      broker,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Trade import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
