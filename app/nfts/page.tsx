"use client";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../_components/ui/button";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc721";
import { contract } from "@/providers/thirdwebProvider";
import { getNFTs } from "thirdweb/extensions/erc721";

export default function Page() {
  const [nfts, setNfts] = useState<any[]>();
  const account = useActiveAccount();

  useEffect(() => {
    const claim = async () => {
      const nft = await getNFTs({
        contract,
        start: 0,
        count: 10,
      });
      setNfts(nft);
    };
    claim();
  }, []);

  const getNftImageUrl = (img: string) => {
    if (!img) return "/images/nfts/default.png";

    if (img.startsWith("ipfs://ipfs/")) {
      return `https://cloudflare-ipfs.com/ipfs/${img.substring(12)}`;
    }

    if (img.startsWith("ipfs")) {
      return `https://cloudflare-ipfs.com/ipfs${img.substring(6)}`;
    }

    if (img.split("/").length < 2) {
      return `https://cloudflare-ipfs.com/ipfs/${img}`;
    }

    return "/images/nfts/default.png";
  };

  return (
    <div className="w-[95%] mx-auto h-full py-4 space-y-6">
      <h4 className="text-3xl font-semibold">Botanium AI NFTs</h4>
      <div className="flex flex-wrap gap-20">
        {nfts &&
          nfts?.map(({ metadata, id }: { metadata: any; id: string }) => (
            <div
              key={id}
              className="min-w-64 border border-[#252F45] rounded-xl"
            >
              <Image
                src={getNftImageUrl(metadata?.image)}
                className="rounded-t-xl h-40"
                width={300}
                height={300}
                alt="NFT"
              />
              <div className=" px-2.5 pt-4 pb-3 space-y-4 bg-[#252F45] rounded-b-xl text-white">
                <div className="flex justify-between items-center">
                  <p className="text-white/90">{metadata?.name}</p>
                  <div className="text-white/70 flex items-center gap-1.5">
                    <p className="font-light">@botanium</p>
                    <BadgeCheck className="text-green-600 w-5" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <TransactionButton
                    className="!w-full !bg-[#FFB72D] hover:bg-[#FFB72D]/95 !text-[#18181B] !h-9 text-[15px] font-medium"
                    transaction={() =>
                      claimTo({
                        contract: contract,
                        to: account?.address as string,
                        quantity: BigInt(1),
                      })
                    }
                    onTransactionConfirmed={() => console.log("success")}
                    onError={(e) => console.log(e)}
                  >
                    Claim
                  </TransactionButton>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
