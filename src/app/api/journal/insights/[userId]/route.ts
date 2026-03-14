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

    const entries = await JournalEntry.find({ userId });

    if (entries.length === 0) {
      return NextResponse.json({
        totalEntries: 0,
        topEmotion: "none",
        mostUsedAmbience: "none",
        recentKeywords: [],
      });
    }

    const emotions = entries.map((e) => e.emotion).filter(Boolean) as string[];
    const ambiences = entries.map((e) => e.ambience);
    const keywords = entries.flatMap((e) => e.keywords);

    const topEmotion = emotions.length 
      ? Object.entries(
          emotions.reduce((acc: Record<string, number>, curr: string) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "calm";

    const mostUsedAmbience = ambiences.length
      ? Object.entries(
          ambiences.reduce((acc: any, curr: any) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
          }, {})
        ).sort((a: any, b: any) => b[1] - a[1])[0][0]
      : "forest";

    const recentKeywords = Array.from(new Set(keywords)).slice(0, 5);

    return NextResponse.json({
      totalEntries: entries.length,
      topEmotion,
      mostUsedAmbience,
      recentKeywords,
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
