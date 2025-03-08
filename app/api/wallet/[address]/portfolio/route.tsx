import { BLOCKSCOUT_API } from "@/constants/contracts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;

    const response = await fetch(
      `${BLOCKSCOUT_API}/addresses/${address}`,

      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Blockscout API error: ${response.statusText}`);
    }

    const data = await response.json();

    // const processedData = {
    //   tokens: data.map((item: any) => ({
    //     address: item.token.address,
    //     symbol: item.token.symbol,
    //     name: item.token.name,
    //     balance: item.value,
    //     decimals: parseInt(item.token.decimals),
    //     type: item.token.type,
    //     icon: item.token.icon_url,
    //     valueUSD: item.token.exchange_rate
    //       ? (
    //           parseFloat(item.value) * parseFloat(item.token.exchange_rate)
    //         ).toString()
    //       : undefined,
    //   })),
    //   summary: {
    //     totalTokens: data.length,
    //     types: data.reduce((acc: any, item: any) => {
    //       acc[item.token.type] = (acc[item.token.type] || 0) + 1;
    //       return acc;
    //     }, {}),
    //   },
    // };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
