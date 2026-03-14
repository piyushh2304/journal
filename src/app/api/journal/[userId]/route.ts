import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    console.log("Fetching entries for userId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const entries = await JournalEntry.find({ userId })
      .sort({ createdAt: -1 });

    console.log(`Found ${entries.length} entries for user ${userId}`);
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
