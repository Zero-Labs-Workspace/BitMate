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

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
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

	return response.data;
};

const DashboardTokens = () => {
	const {
		data: tokens,
		isLoading,
		isError,
	} = useQuery(["tokens"], fetchTokens);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching tokens</div>;
	}

	return (
		<Card className="bg-zinc-900 border-zinc-800">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-white">Trending Tokens</CardTitle>

				<Button variant="ghost" size="sm" >
					View all assets <ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			</CardHeader>

			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="border-zinc-800 text-white">
							<TableHead >
								Token
							</TableHead>

							<TableHead >
								Price
							</TableHead>

							<TableHead >
								Market Cap
							</TableHead>

							<TableHead >
								24h Change
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{tokens.map((token: any) => (
							<TableRow
								key={token.id}
								className="border-zinc-800"
							>
								<TableCell className="font-medium text-white">
									<div className="flex items-center gap-2">
										<img
											src={token?.image}
											alt={token?.name}
											className="w-6 h-6 rounded-full"
										/>

										{token.name}
									</div>
								</TableCell>

								<TableCell className="text-white">
									{token?.current_price?.toLocaleString(
										"en-US",
										{
											minimumFractionDigits: 2,
										}
									)}
								</TableCell>

								<TableCell className="text-white">
									{token?.market_cap?.toLocaleString("en-US", {
										maximumFractionDigits: 0,
									})}
								</TableCell>

								<TableCell
									className={
										token?.price_change_percentage_24h >= 0
											? "text-emerald-500"
											: "text-red-500"
									}
								>
									{token?.price_change_percentage_24h?.toFixed(
										2
									)}
									%
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default DashboardTokens;
