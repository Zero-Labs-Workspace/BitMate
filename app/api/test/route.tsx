import { NextResponse } from "next/server";

const PROTOCOLS = [
  "moneyonchain",
  "sovryn",
  "rif-on-chain",
  "uniswap-v3",
  "tropykus-rsk",
  "sushi",
  "beefy",
  "gamma",
  "woodswap",
  "steer-protocol",
  "symbiosis",
  "rskswap",
  "segment-finance",
  "elk",
  "blindex",
  "balmy",
  "pell-network",
  "openocean",
  "rootstock-collective",
];

interface ProtocolResponse {
  id: string;
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string;
  audit_links: string[];
  github: string[];
  raises: any[];
  metrics: any;
  mcap: number;
  methodology: string;
}

export async function GET() {
  try {
    const protocolPromises = PROTOCOLS.map(async (protocol) => {
      try {
        const response = await fetch(
          `https://api.llama.fi/protocol/${protocol}`
        );

        if (!response.ok) {
          console.warn(`Failed to fetch ${protocol}: ${response.statusText}`);
          return null;
        }

        const rawData: ProtocolResponse = await response.json();

        // Format the data, excluding TVL-related fields
        const formattedData = {
          id: rawData.id,
          name: rawData.name,
          symbol: rawData.symbol,
          address: rawData.address,
          url: rawData.url,
          description: rawData.description,
          chain: rawData.chain,
          logo: rawData.logo,
          audits: rawData.audits,
          audit_note: rawData.audit_note,
          gecko_id: rawData.gecko_id,
          cmcId: rawData.cmcId,
          category: rawData.category,
          chains: rawData.chains,
          module: rawData.module,
          twitter: rawData.twitter,
          audit_links: rawData.audit_links,
          github: rawData.github,
          mcap: rawData.mcap,
          methodology: rawData.methodology,
        };

        return formattedData;
      } catch (error) {
        console.error(`Error fetching ${protocol}:`, error);
        return null;
      }
    });

    const results = await Promise.all(protocolPromises);

    // Filter out null results from failed requests
    const validResults = results.filter(
      (result): result is NonNullable<typeof result> => result !== null
    );

    return NextResponse.json({
      success: true,
      count: validResults.length,
      protocols: validResults,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch protocol data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
