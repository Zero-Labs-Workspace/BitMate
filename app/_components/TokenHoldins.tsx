"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useActiveAccount } from "thirdweb/react";
import { Loader2 } from "lucide-react";
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
				<CardTitle className="text-white flex flex-col gap-y-2">
					<h1 className="text-2xl font-semibold">Token Holdings</h1>
					<p className="text-base font-normal">
						Your assets will appear here
					</p>
				</CardTitle>
			</CardHeader>
			<CardContent className="h-[340px] overflow-y-auto">
				{isLoading ? (
					<div className="flex justify-center pt-6">
						<Loader2 className="animate-spin text-white" />
					</div>
				) : isError ||
				  !data ||
				  !data.items ||
				  data.items.length === 0 ? (
					<div className="flex flex-col items-center justify-between gap-y-14 h-full">
						<div className="text-center text-white">
							No tokens found
						</div>
						<Image
							src="/holdings-nill.svg"
							alt="No tokens"
							width={250}
							height={250}
						/>
					</div>
				) : (
					<div>
						{data.map((item: any) => (
							<div
								key={item.token.address}
								className="flex items-center justify-between py-4"
							>
								<div className="flex items-center gap-2 text-white">
									{item.token.icon_url ? (
										<img
											src={item.token.icon_url}
											alt={item.token.name}
											className="w-8 h-8 rounded-full"
										/>
									) : (
										<div className="w-8 h-8 rounded-full bg-zinc-800" />
									)}
									<span className="text-lg font-semibold">
										{item.token.name || "Unknown Token"}
									</span>
								</div>
								<div className="text-white">
									{item.value
										? (
												parseInt(item.value) /
												10 ** item.token.decimals
										  ).toFixed(2)
										: "0"}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TokenHoldings;
