"use client";

import { botanixChain } from "@/constants/chains";
import { NFT_CONTRACT } from "@/constants/contracts";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? "",
});

const chain = 3636;

export const contract = getContract({
  client: client,
  address: NFT_CONTRACT,
  chain: defineChain(chain),
});

export function Provider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
