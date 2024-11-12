import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PROMPT_TEMPLATES } from "@/constants/prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

export async function POST(req: Request) {
  try {
    const { type, data, question, address } = await req.json();

    let prompt;
    switch (type) {
      case "transaction":
        prompt = PROMPT_TEMPLATES.transactionAnalysis(data);
        break;
      case "portfolio":
        prompt = PROMPT_TEMPLATES.portfolioAdvice(data.portfolio, data.market);
        break;
      case "chat":
        prompt = PROMPT_TEMPLATES.chatAssistant(data, question, address);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid analysis type" },
          { status: 400 }
        );
    }

    console.log("Prompt:", prompt);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2024,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    console.log("AI Analysis Response:", response.content[0]);

    return NextResponse.json({
      analysis: response?.content[0]?.text ,
      type,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
