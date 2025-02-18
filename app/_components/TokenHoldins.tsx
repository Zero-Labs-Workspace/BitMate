"use client";
import { useQuery } from "@tanstack/react-query";
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
import { useActiveAccount } from "thirdweb/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const fetchTokenHoldings = async (address:any) => {
  const response = await axios.get(
    `https://rootstock-testnet.blockscout.com/api/v2/addresses/${address}/tokens?type=ERC-20,ERC-721,ERC-1155`
  );
  return response.data.slice(0,6);
};

const TokenHoldings = () => {
  const account = useActiveAccount();
  const address = account?.address;

  const { data, isLoading, isError } = useQuery(
    ["token-holdings", address],
    () => fetchTokenHoldings(address),
    {
      enabled: Boolean(address),
      staleTime: 1000 * 60 * 5, 
    }
  );

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Token Holdings</CardTitle>
      </CardHeader>
      <CardContent className="h-fit">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-white" />
          </div>
        ) : isError || !data || !data.items || data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-between gap-y-14 h-full">
            <div className="text-center text-white">No tokens found</div>
            <Image
              src="/holdings-nill.svg"
              alt="No tokens"
              width={250}
              height={250}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-400">Token</TableHead>
                <TableHead className="text-zinc-400">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item:any) => (
                <TableRow
                  key={item?.token?.address}
                  className="border-zinc-800"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 text-white">
                      {item.token.icon_url ? (
                        <img
                          src={item.token.icon_url}
                          alt={item.token.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-800" />
                      )}
                      {item?.token?.name || "Unknown Token"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.value
                      ? (parseInt(item.value) / 10 ** item.token.decimals).toFixed(2)
                      : "0"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenHoldings;
