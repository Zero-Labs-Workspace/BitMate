import { z } from "zod";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const res = await fetch("https://api.BlockPilot/api/v0/agent/knowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-Block Pilot-api-key": process.env.BlockPilot_API_KEY ?? "",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json("Internal server error", { status: 500 });
  }
}
