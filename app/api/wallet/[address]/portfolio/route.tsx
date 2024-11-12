import { BLOCKSCOUT_API } from "@/constants/contracts";
import { NextResponse } from "next/server";

interface Token {
  address: string;
  decimals: string;
  name: string;
  symbol: string;
  type: string;
  value: string;
  icon_url: string | null;
}

interface ProcessedToken {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  type: string;
  icon: string | null;
  valueUSD?: string;
}

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;

    const response = await fetch(
      `${BLOCKSCOUT_API}/addresses/${address}/token-balances`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Blockscout API error: ${response.statusText}`);
    }
    console.log("hohoho");

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
