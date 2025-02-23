"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, FormField, FormItem } from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import ReactMarkdown from "react-markdown";
import { useActiveAccount } from "thirdweb/react";
import { Bot, ExternalLink, Send, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidWalletAddress, findToken } from "../../lib/utils";
import {
	getContract,
	prepareTransaction,
	sendTransaction,
	toWei,
} from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { client } from "@/providers/thirdwebProvider";
import { rootstackTestnetChain } from "@/constants/chains";
import { Account, getWalletBalance } from "thirdweb/wallets";
import { isAddress } from "thirdweb/utils";
import { useActiveWallet } from "thirdweb/react";
import { Label } from "../_components/ui/label";
import { Switch } from "../_components/ui/switch";

type Message = {
	role: "user" | "bot";
	content: string | React.ReactNode;
};

const formSchema = z.object({
	inputTxt: z.string().min(2).max(100),
});

const BLOCK_EXPLORER_URL = "https://rootstock-testnet.blockscout.com/tx/";

export default function Page() {
	const account = useActiveAccount();
	const wallet = useActiveWallet();
	const [address, setAddress] = useState("");
	const [portfolioData, setPortfolioData] = useState<any>(null);
	const [portfolioLoading, setPortfolioLoading] = useState(true);
	const [isTransactionMode, setIsTransactionMode] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "bot",
			content:
				"Hey DeFi Explorer! I'm here to help you navigate the DeFi universe.",
		},
	]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inputTxt: "",
		},
	});

	const fetchPortfolio = async (walletAddress: string) => {
		try {
			setPortfolioLoading(true);
			const response = await fetch(
				`/api/wallet/${walletAddress}/portfolio`
			);
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`);
			return await response.json();
		} catch (error) {
			console.error("Failed to fetch portfolio data:", error);
			throw error;
		} finally {
			setPortfolioLoading(false);
		}
	};

	useEffect(() => {
		if (account?.address) {
			setAddress(account.address);
			fetchPortfolio(account.address)
				.then(setPortfolioData)
				.catch((error) => {
					setMessages((prev) => [
						...prev,
						{
							role: "bot",
							content:
								"Failed to load portfolio data. Please try again later.",
						},
					]);
				});
		}
	}, [account?.address]);

	useEffect(() => {
		if (address && isAddress(address)) {
			fetchPortfolio(address).then(setPortfolioData).catch(console.error);
		}
	}, [address]);

	const handleTransfer = async (data: any) => {
		try {
			const tokenAddress =
				data.token1.toLowerCase() === "trbtc"
					? "trbtc"
					: await findToken(data.token1);

			if (!tokenAddress) throw new Error("Token not found");

			let transaction;
			if (tokenAddress === "trbtc") {
				transaction = prepareTransaction({
					to: data.address,
					chain: rootstackTestnetChain,
					client: client,
					value: toWei(data.amount),
				});
			} else {
				const contract = getContract({
					address: tokenAddress,
					chain: rootstackTestnetChain,
					client,
				});

				transaction = transfer({
					contract,
					to: data.address,
					amount: data.amount,
				});
			}

			return await sendTransaction({
				transaction,
				account: account as Account,
			});
		} catch (error) {
			console.error("Transfer failed:", error);
			throw error;
		}
	};

	const handleBalance = async (data: any) => {
		try {
			const tokenAdd =
				data.token1.toLowerCase() === "trbtc"
					? "trbtc"
					: await findToken(data.token1);

			if (!tokenAdd && data.token1.toLowerCase() !== "trbtc") {
				throw new Error("Token not found");
			}

			const acc = isAddress(data.address)
				? data.address
				: account?.address;

			return tokenAdd === "trbtc"
				? await getWalletBalance({
						address: acc,
						client,
						chain: rootstackTestnetChain,
				  })
				: await getWalletBalance({
						address: acc,
						tokenAddress: tokenAdd!,
						client,
						chain: rootstackTestnetChain,
				  });
		} catch (error) {
			console.error("Failed to fetch balance:", error);
			throw error;
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (portfolioLoading) {
			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					content: "Please wait while I fetch the portfolio data...",
				},
			]);
			return;
		}

		const newMessages = [
			...messages,
			{ role: "user" as const, content: values.inputTxt },
			{ role: "bot" as const, content: "Processing your request..." },
		];
		setMessages(newMessages);
		form.reset();

		try {
			if (isTransactionMode) {
				// Transaction Mode
				const response = await fetch("/api/extract", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt: values.inputTxt }),
				});
				const data = await response.json();
				const action = data.result.completion[0]?.action;

				switch (action) {
					case "transfer":
						if (
							!isValidWalletAddress(
								data.result.completion[0].address
							)
						) {
							throw new Error("Invalid wallet address");
						}
						const result = await handleTransfer(
							data.result.completion[0]
						);
						setMessages([
							...newMessages,
							{
								role: "bot",
								content: (
									<div className="flex items-center gap-2">
										<span>Transaction sent: </span>
										<a
											href={`${BLOCK_EXPLORER_URL}${result.transactionHash}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
										>
											{`${result.transactionHash.slice(
												0,
												6
											)}...${result.transactionHash.slice(
												-4
											)}`}
											<ExternalLink size={16} />
										</a>
									</div>
								),
							},
						]);
						break;

					case "balance":
						const balance = await handleBalance(
							data.result.completion[0]
						);
						setMessages([
							...newMessages,
							{
								role: "bot",
								content: `Balance: ${balance.displayValue} ${balance.symbol}`,
							},
						]);
						break;

					default:
						setMessages([
							...newMessages,
							{
								role: "bot",
								content:
									"Command not recognized. Available commands: transfer, balance",
							},
						]);
				}
			} else {
				// Strategy Mode
				const response = await fetch("/api/ai", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						type: "chat",
						data: portfolioData,
						question: values.inputTxt,
						address: address || account?.address,
					}),
				});

				const data = await response.json();
				console.log({ data });
				setMessages([
					...newMessages,
					{
						role: "bot",
						content: (
							<ReactMarkdown>
								{data.analysis ||
									"No strategy available for this query."}
							</ReactMarkdown>
						),
					},
				]);
			}
		} catch (error) {
			setMessages([
				...newMessages,
				{
					role: "bot",
					content: `Error: ${
						error instanceof Error
							? error.message
							: "Operation failed"
					}`,
				},
			]);
		}
	};
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	if (!wallet) {
		return (
			<div className="h-full flex flex-col gap-y-3 items-center justify-center text-4xl font-bold">
				Connect your wallet
			</div>
		);
	}

	return (
		<div className="h-full max-h-full w-full relative overflow-y-clip">
			<div className="flex items-center justify-between w-full px-6 border-b border-[#444444] py-3">
				<div className="space-y-1.5">
					<h5 className="text-3xl font-bold text-white">
						DeFi Sage AI
					</h5>
					<div className="flex flex-col">
						<p className="text-sm text-slate-100 opacity-80">
							Intelligent DeFi Assistant for Transactions &
							Strategy
						</p>
					</div>
				</div>
				<div className="flex items-center gap-x-4">
					<Input
						type="text"
						placeholder="Wallet address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						className="w-64 bg-transparent text-white placeholder-gray-400 border-zinc-800 focus-visible:ring-0"
					/>
					<div className="flex items-center gap-2">
						<Switch
							checked={isTransactionMode}
							onCheckedChange={setIsTransactionMode}
							className="data-[state=checked]:bg-primary"
						/>
						<Label className="text-sm font-medium">
							{isTransactionMode
								? "Transaction Mode"
								: "Strategy Mode"}
						</Label>
					</div>
				</div>
			</div>

			<div className="w-[98%] h-[90%] mx-auto flex flex-col">
				<div
					className="flex-1 overflow-y-auto py-10 flex flex-col gap-y-10"
					ref={containerRef}
				>
					{messages.map(({ role, content }, index) => (
						<div
							key={index}
							className={`flex items-center gap-4 ${
								role === "user"
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`flex ${
									role === "user"
										? "flex-row-reverse"
										: "flex-row"
								} items-center`}
							>
								<div
									className={`p-3 ${
										role === "user"
											? "bg-[#3f3f46]"
											: "bg-gradient-to-bl from-primary to-[#db00e9]"
									} rounded-full`}
								>
									{role === "user" ? <User /> : <Bot />}
								</div>
								<div
									className={`mx-4 ${
										role === "bot"
											? "bg-[#ff910079] p-2 rounded-lg min-w-40 max-w-[85%]"
											: ""
									}`}
								>
									{content}
								</div>
							</div>
						</div>
					))}
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-4 sticky bottom-0 backdrop-blur-lg mt-0.5"
					>
						<FormField
							control={form.control}
							name="inputTxt"
							render={({ field }) => (
								<FormItem className="w-full">
									<Input
										{...field}
										placeholder={
											isTransactionMode
												? "Enter transaction details..."
												: "Ask for DeFi strategy..."
										}
										disabled={portfolioLoading}
										className="w-full bg-transparent border-[#444444] focus-visible:ring-0 outline-none"
									/>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={portfolioLoading}
							className={`bg-gradient-to-br from-primary to-[#c200e9] rounded-xl ${
								portfolioLoading ? "opacity-50" : ""
							}`}
						>
							<Send />
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
