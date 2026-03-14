import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze the following journal entry for emotion and key themes.
      Return the response in strictly valid JSON format with the following keys:
      "emotion": a single word representing the primary emotion (e.g., calm, anxious, joyful)
      "keywords": an array of 3-5 relevant keywords from the text
      "summary": a brief 1-sentence summary of the user's state.

      Journal text: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean potential markdown formatting from LLM response
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(jsonString);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing text with LLM:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
