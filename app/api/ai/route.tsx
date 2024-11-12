import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

export async function POST(req: Request) {
  try {
    const { type, data, question } = await req.json();

    let prompt;
    switch (type) {
      case "transaction":
        prompt = PROMPT_TEMPLATES.transactionAnalysis(data);
        break;
      case "portfolio":
        prompt = PROMPT_TEMPLATES.portfolioAdvice(data.portfolio, data.market);
        break;
      case "chat":
        prompt = PROMPT_TEMPLATES.chatAssistant(data, question);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid analysis type" },
          { status: 400 }
        );
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2024,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return NextResponse.json({
      analysis: response.content,
      type,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
