"use client";

import { TrendingUp, ArrowRight, Plus, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "./_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import TopNfts from "./_components/TopNfts";

export default function Component() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useActiveAccount();

  const chartConfig = {
    netWorth: {
      label: "Net Worth",
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch(`https://rootstock-testnet.blockscout.com/api/v2/addresses/${account}/coin-balance-history-by-day`);
        setLoading(false)
        const { items } = await response.json();

        // If items is empty or null, use default data
        const formattedData = items && items.length > 0
          ? items.map((item:any) => ({
              month: new Date(item.date).toLocaleString("default", { month: "short" }), 
              netWorth: Number(item.value) / 1e18, 
            }))
          : [
              { month: "Jan", netWorth: 0 },
              { month: "Feb", netWorth: 0 },
              { month: "Mar", netWorth: 0 },
              { month: "Apr", netWorth: 0 },
              { month: "May", netWorth: 0 },
              { month: "Jun", netWorth: 0 },
            ];

        setPortfolioData(formattedData);
      } catch (error) {
        setLoading(false)
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen text-white">
     
     <div className="grid grid-cols-3 gap-4">
       <Card className="bg-transparent border-zinc-800 col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Total Net Worth
          </CardTitle>
          <CardDescription className="text-slate-100">
            Showing net worth for the last few months
          </CardDescription>
        </CardHeader>
        <CardContent className="my-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full text-white">
            {loading ? (
              <p><Loader2 className="animate-spin mx-auto"/></p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={portfolioData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
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
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value / 1000}`}
                    stroke="#fff"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent indicator="dot" hideLabel className="text-white" />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
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

      <DashboardTokens />
      <TopNfts />
    </div>
  );
}
