"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

// Fetch functions
const fetchTokenList = async () => {
	const response = await fetch(
		"https://rootstock.blockscout.com/api/v2/tokens?type=ERC-721%2CERC-1155"
	);
	const data = await response.json();
	return data?.items?.slice(0, 5); // Only take the first 5 tokens
};

const fetchTokenDetails = async (address: any) => {
	const response = await fetch(
		`https://rootstock.blockscout.com/api/v2/tokens/${address}`
	);
	return response.json();
};

const TopNfts = () => {
	// Query for initial token list
	const tokenListQuery = useQuery({
		queryKey: ["tokenList"],
		queryFn: fetchTokenList,
	});

	// Query for detailed token information
	const tokenDetailsQueries = useQuery({
		queryKey: ["tokenDetails"],
		queryFn: async () => {
			if (!tokenListQuery?.data) return [];

			const addresses = tokenListQuery?.data?.map(
				(token: any) => token?.address
			);
			const detailsPromises = addresses.map(fetchTokenDetails);
			return Promise.all(detailsPromises);
		},
		enabled: !!tokenListQuery.data,
	});

	// Loading state for initial token list
	if (tokenListQuery?.isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[...Array(5)].map((_, i) => (
					<Card
						key={i}
						className="w-full bg-transparent border-zinc-800"
					>
						<CardHeader>
							<Skeleton className="h-4 w-[250px] bg-zinc-800" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-48 w-full bg-zinc-800" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	// Error state for initial token list
	if (tokenListQuery.isError) {
		return <div className="text-red-500">Error loading tokens</div>;
	}

	// Loading state for detailed token information
	if (tokenDetailsQueries.isLoading) {
		return <div className="text-gray-500">Loading token details...</div>;
	}

	const tokens = tokenDetailsQueries.data || [];

	return (
		<Card className="bg-zinc-900 border-zinc-800">
			<CardHeader>
				<CardTitle className="text-white">Trending Tokens</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{tokens.map((token) => (
						<Card className="w-full h-[20rem] max-w-sm overflow-hidden bg-[#18181B] rounded-xl border-zinc-800">
							<CardHeader className="h-full flex flex-col justify-between items-center p-4 space-y-4">
								{token ? (
									<Image
										src={
											token?.icon_url ||
											"/timed-out-error.svg"
										}
										alt={"alt"}
										width={500}
										height={500}
										className="w-2/3 aspect-square object-cover rounded-lg"
									/>
								) : (
									<div className="w-full aspect-square rounded-lg flex items-center justify-center">
										<span className="text-gray-400">
											No Image
										</span>
									</div>
								)}
								<CardTitle className="text-lg font-normal text-gray-400 mt-auto">
									{token.name || "Name"}
								</CardTitle>
							</CardHeader>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TopNfts;
