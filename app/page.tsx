"use client";

import { Loader2, AlertCircle } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./_components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./_components/ui/chart";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import DashboardTokens from "./_components/top-coins";
import TokenHoldings from "./_components/TokenHoldins";
import { projects } from "@/constants/market";
import { isAddress } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";
import { rootstackTestnetChain } from "@/constants/chains";
import { client } from "@/providers/thirdwebProvider";
import { ProjectCard } from "./_components/ProjectCard";
import Header from "./_components/common/header";

interface PortfolioData {
  month: string;
  netWorth: number;
  displayWorth: number; // New property for pre-formatted value
}

export default function Component() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<string>("0.0000 tRBTC");
  const account = useActiveAccount();

  const acc = account
    ? isAddress(account.address)
      ? account.address
      : account.address
    : undefined;

  const isWalletConnected = !!acc;

  const chartConfig = {
    netWorth: {
      label: "Net Worth",
      color: "hsl(var(--chart-1))",
    },
  };

  const formatBlockchainValue = (value: number | null | undefined): string => {
    if (!value || isNaN(value) || value === 0) {
      return "0.0000 tRBTC";
    }

    const tokenValue = value / 1e18;

    if (tokenValue >= 1e6) {
      return `${(tokenValue / 1e6).toFixed(4)}M tRBTC`;
    } else if (tokenValue >= 1e3) {
      return `${(tokenValue / 1e3).toFixed(4)}K tRBTC`;
    } else if (tokenValue >= 1) {
      return `${tokenValue.toFixed(4)} tRBTC`;
    } else if (tokenValue > 0) {
      return tokenValue < 0.0001
        ? `${tokenValue.toExponential(4)} tRBTC`
        : `${tokenValue.toFixed(4)} tRBTC`;
    }
    return "0.0000 tRBTC";
  };

  // Convert raw blockchain value to human-readable number
  const convertToDisplayValue = (rawValue: number): number => {
    return rawValue / 1e18;
  };

  // Simple formatter for Y-axis that doesn't use the full formatBlockchainValue
  const formatYAxisValue = (value: number): string => {
    if (value === 0) return "0";

    // Value is already converted, just format it
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    } else if (value >= 1) {
      return value.toFixed(2);
    } else {
      return value.toFixed(4);
    }
  };

  // Fetch wallet balance
  useEffect(() => {
    async function fetchBalance() {
      if (!isWalletConnected) return;

      try {
        const balance = await getWalletBalance({
          address: acc,
          client,
          chain: rootstackTestnetChain,
        });

        const formattedBalance = formatBlockchainValue(Number(balance.value));
        setWalletBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setWalletBalance("0.0000 tRBTC");
      }
    }

    fetchBalance();
  }, [acc, isWalletConnected]);

  // Fetch portfolio data
  useEffect(() => {
    async function fetchData() {
      if (!isWalletConnected) {
        setPortfolioData(
          Array.from({ length: 6 }, (_, index) => ({
            month: new Date(0, index).toLocaleString("default", {
              month: "short",
            }),
            netWorth: 0,
            displayWorth: 0,
          }))
        );
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://rootstock-testnet.blockscout.com/api/v2/addresses/${acc}/coin-balance-history-by-day`
        );
        const { items } = await response.json();

        const formattedData: PortfolioData[] =
          items && Array.isArray(items) && items.length > 0
            ? items.map((item: any) => {
                const rawWorth = Number(item.value) || 0;
                return {
                  month: new Date(item.date).toLocaleString("default", {
                    month: "short",
                  }),
                  netWorth: rawWorth,
                  displayWorth: convertToDisplayValue(rawWorth), // Pre-convert for chart display
                };
              })
            : Array.from({ length: 6 }, (_, index) => ({
                month: new Date(0, index).toLocaleString("default", {
                  month: "short",
                }),
                netWorth: 0,
                displayWorth: 0,
              }));

        setPortfolioData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPortfolioData(
          Array.from({ length: 6 }, (_, index) => ({
            month: new Date(0, index).toLocaleString("default", {
              month: "short",
            }),
            netWorth: 0,
            displayWorth: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [acc, isWalletConnected]);

  // Function to render wallet connection message
  const renderWalletConnectionMessage = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
        <AlertCircle size={48} className="text-amber-500" />
        <h3 className="text-xl font-semibold text-center text-white">
          Wallet Not Connected
        </h3>
        <p className="text-slate-300 text-center max-w-md">
          Connect your wallet to view your portfolio data and token holdings on
          the Rootstock testnet.
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 min-h-screen text-white">
      <Header
        title="Dashboard"
        description="Keep track of your wallet and the Rootstock ecosystem dAPPs"
      />
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-transparent border-zinc-800 col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h5 className="text-2xl font-bold text-white">
                  Total Net Worth (tRBTC)
                </h5>
                <p className="text-slate-100">
                  Showing net worth for the last few months
                </p>
              </div>
              <div className="flex flex-col items-end">
                <h5 className="text-2xl font-bold text-white">
                  {walletBalance}
                </h5>
              </div>
            </div>
          </CardHeader>
          <CardContent className="my-4">
            <ChartContainer
              config={chartConfig}
              className="h-[310px] w-full text-white"
            >
              {!isWalletConnected ? (
                renderWalletConnectionMessage()
              ) : loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-primary" size={48} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <CartesianGrid vertical={false} stroke="#333" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                      stroke="#fff"
                    />
                    <YAxis
                      dataKey="displayWorth"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={formatYAxisValue}
                      stroke="#fff"
                      width={80}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          hideLabel
                          className="text-white"
                          formatter={(value, name, { dataKey, payload }) => {
                            // Use the original netWorth for full formatting in tooltip
                            if (dataKey === "displayWorth") {
                              return [
                                formatBlockchainValue(payload.netWorth),
                                "Net Worth",
                              ];
                            }
                            return [value, name];
                          }}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="displayWorth"
                      name="Net Worth"
                      fill="#FF9100"
                      fillOpacity={0.4}
                      stroke="#FF9100"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
        <TokenHoldings />
      </div>

      {!isWalletConnected ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            {renderWalletConnectionMessage()}
          </CardContent>
        </Card>
      ) : (
        <DashboardTokens />
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Trending Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
