"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useActiveAccount } from "thirdweb/react";
import { Loader2, AlertCircle, Wallet } from "lucide-react";
import Image from "next/image";

const fetchTokenHoldings = async (address: any) => {
  const response = await axios.get(
    `https://rootstock-testnet.blockscout.com/api/v2/addresses/${address}/tokens?type=ERC-20,ERC-721,ERC-1155`
  );
  return response.data.slice(0, 6);
};

const TokenHoldings = () => {
  const account = useActiveAccount();
  const address = account?.address;
  const isWalletConnected = !!address;

  const { data, isLoading, isError } = useQuery(
    ["token-holdings", address],
    () => fetchTokenHoldings(address),
    {
      enabled: Boolean(address),
      staleTime: 1000 * 60 * 5,
    }
  );

  const renderWalletConnectionMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 space-y-4">
        <AlertCircle size={40} className="text-amber-500" />
        <p className="text-slate-300 text-center">
          Connect your wallet to view your token holdings
        </p>
      </div>
    );
  };

  const renderNoTokensFound = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full py-4 space-y-6">
        <div className="w-32 h-32 relative">
          <Image
            src="/holdings-nill.svg"
            alt="No tokens"
            fill
            objectFit="contain"
          />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-white text-lg font-medium">No Tokens Found</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Your wallet doesn't have any tokens yet. You can get testnet tokens
            from the faucet or transfer them from another wallet.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-amber-500">
          <Wallet size={16} />
          <span className="text-sm">
            Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!isWalletConnected) {
      return renderWalletConnectionMessage();
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-amber-500" size={36} />
            <p className="text-slate-300 text-sm">Loading your tokens...</p>
          </div>
        </div>
      );
    }

    if (isError || !data || !data.items || data.items.length === 0) {
      return renderNoTokensFound();
    }

    return (
      <div>
        {data.map((item: any) => (
          <div
            key={item.token.address}
            className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0"
          >
            <div className="flex items-center gap-2 text-white">
              {item.token.icon_url ? (
                <img
                  src={item.token.icon_url}
                  alt={item.token.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                  {(item.token.symbol || item.token.name || "?")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-semibold">
                  {item.token.name || "Unknown Token"}
                </span>
                <span className="text-xs text-slate-400">
                  {item.token.symbol || "???"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-white">
              <span className="font-medium">
                {item.value
                  ? (parseInt(item.value) / 10 ** item.token.decimals).toFixed(
                      4
                    )
                  : "0"}
              </span>
              <span className="text-xs text-slate-400">
                {item.token.symbol || ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex flex-col gap-y-2">
          <h1 className="text-2xl font-semibold">Token Holdings</h1>
          <p className="text-base font-normal">Your assets will appear here</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[340px] overflow-y-auto">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default TokenHoldings;
