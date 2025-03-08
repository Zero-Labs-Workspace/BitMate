"use client";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchTokens = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        category: "rootstock-ecosystem",
      },
      headers: {
        "x-cg-demo-api-key": "CG-FhgpMP8NqfuKiBmSibfkK8mv",
      },
    }
  );

  return response.data.slice(0, 5);
};

const DashboardTokens = () => {
  const {
    data: tokens,
    isLoading,
    isError,
  } = useQuery(["tokens"], fetchTokens);

  if (isError) {
    return <div>Error fetching tokens</div>;
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Trending Tokens</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 text-white">
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>24h Change</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="border-zinc-800">
                <TableCell colSpan={4} className="text-center py-6">
                  <Loader2 className="animate-spin text-white mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              tokens?.map((token: any) => (
                <TableRow key={token.id} className="border-zinc-800">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={token?.image}
                        alt={token?.name}
                        className="size-10 rounded-full"
                      />
                      <span className="text-lg">{token.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-white text-lg">
                    ${` `}
                    {token?.current_price?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>

                  <TableCell className="text-white text-lg">
                    ${` `}
                    {token?.market_cap?.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>

                  <TableCell
                    className={`flex items-center gap-x-4 ${
                      token?.price_change_percentage_24h >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {token?.price_change_percentage_24h >= 0 ? (
                      <ArrowUp className="text-emerald-500" />
                    ) : (
                      <ArrowDown className="text-red-500" />
                    )}
                    {token?.price_change_percentage_24h?.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DashboardTokens;
