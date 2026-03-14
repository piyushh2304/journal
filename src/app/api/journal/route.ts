import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function POST(req: NextRequest) {
  console.log("POST /api/journal hit");
  try {
    const body = await req.json();
    console.log("Request body:", body);
    const { userId, ambience, text } = body;

    if (!userId || !ambience || !text) {
      console.warn("Validation failed: Missing fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log("Creating entry in database...");
    
    const entry = await JournalEntry.create({
      userId,
      ambience,
      text,
    });

    console.log("Entry created successfully:", entry._id);
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    console.error("CRITICAL error creating journal entry:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
