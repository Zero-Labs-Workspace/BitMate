import { BLOCKSCOUT_API } from "@/constants/contracts";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;

    const response = await fetch(
      `${BLOCKSCOUT_API}/addresses/${address}/transactions?filter=to%20%7C%20from`,
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

    //   // Process transactions to include decoded data and insights
    //   const processedData = {
    //     transactions: data.items.map((tx: any) => ({
    //       hash: tx.hash,
    //       method: tx.method,
    //       timestamp: tx.timestamp,
    //       value: tx.value,
    //       status: tx.status,
    //       from: tx.from.hash,
    //       to: tx.to?.hash,
    //       gasUsed: tx.gas_used,
    //       type: tx.tx_types?.[0] || 'unknown',
    //       error: tx.revert_reason?.reason || null,
    //     })),
    //     summary: {
    //       total: data.items.length,
    //       successful: data.items.filter((tx: any) => tx.status === 'ok').length,
    //       failed: data.items.filter((tx: any) => tx.status === 'error').length,
    //     }
    //   };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
