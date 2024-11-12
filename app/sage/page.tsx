"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, FormField, FormItem } from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { useActiveAccount } from "thirdweb/react";
import { Bot, ExternalLink, Send, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	isValidWalletAddress,
	findToken,
	fetchPortfolioData,
} from "../../lib/utils";
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
	const [address, setAddress] = useState("");
	const [portfolioData, setPortfolioData] = useState<any>(null);
	const [portfolioLoading, setPortfolioLoading] = useState(true);
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "bot",
			content:
				"Hey DeFi Explorer! I'm here to help you navigate the DeFi universe. Check your balance, make transactions, and explore much more.",
		},
	]);
	const [isOnchain, setIsOnchain] = useState(false);
	const wallet = useActiveWallet();
	const containerRef = useRef<HTMLDivElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inputTxt: "",
		},
	});

	// Function to fetch portfolio data
	const fetchPortfolio = async (walletAddress: string) => {
		try {
			setPortfolioLoading(true);
			const response = await fetch(
				`/api/wallet/${walletAddress}/portfolio`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Failed to fetch portfolio data:", error);
			throw error;
		} finally {
			setPortfolioLoading(false);
		}
	};

	// Initialize with account's address and fetch portfolio
	useEffect(() => {
		const initializeData = async () => {
			if (account?.address) {
				try {
					setAddress(account.address);
					const data = await fetchPortfolio(account.address);
					setPortfolioData(data);
				} catch (error) {
					console.error(
						"Failed to initialize portfolio data:",
						error
					);
					setMessages((prev) => [
						...prev,
						{
							role: "bot",
							content:
								"Failed to load portfolio data. Please try again later.",
						},
					]);
				}
			}
		};

		initializeData();
	}, [account?.address]);

	// Handle address changes
	useEffect(() => {
		const loadNewAddress = async () => {
			if (address && isAddress(address)) {
				try {
					setPortfolioLoading(true);
					const data = await fetchPortfolio(address);
					setPortfolioData(data);
				} catch (error) {
					console.error(
						"Failed to fetch portfolio for new address:",
						error
					);
				}
			}
		};

		loadNewAddress();
	}, [address]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	};

	const fetchExtracts = async (query: string) => {
		try {
			const response = await fetch(`/api/extract`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: query }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.result.completion;
		} catch (error) {
			console.error("Failed to fetch extracts:", error);
			return [];
		}
	};

	const fetchInfo = async ({
		type,
		data,
		question,
	}: {
		type: string;
		data: any;
		question: string;
	}) => {
		try {
			const response = await fetch(`/api/ai`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type,
					data,
					question,
					address: address || account?.address,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = await response.json();
			return responseData.analysis;
		} catch (error) {
			console.error("Failed to fetch info:", error);
			throw error;
		}
	};

	const handleTransfer = async (data: any) => {
		try {
			const tokenAddress =
				data.token1.toLowerCase() === "trbtc"
					? "trbtc"
					: await findToken(data.token1);

			if (!tokenAddress) {
				throw new Error("Token not found");
			}

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

			const transactionResult = await sendTransaction({
				transaction,
				account: account as Account,
			});

			return transactionResult;
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

			const balance =
				tokenAdd === "trbtc"
					? await getWalletBalance({
							address: acc,
							client,
							chain: rootstackTestnetChain,
					  })
					: await getWalletBalance({
							address: acc,
							tokenAddress: tokenAdd,
							client,
							chain: rootstackTestnetChain,
					  });

			return balance;
		} catch (error) {
			console.error("Failed to fetch balance:", error);
			throw error;
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (portfolioLoading) {
			setMessages([
				...messages,
				{
					role: "bot",
					content: "Please wait while I fetch the portfolio data...",
				},
			]);
			return;
		}

		if (!isOnchain && !portfolioData) {
			setMessages([
				...messages,
				{
					role: "bot",
					content:
						"Portfolio data is not available. Please try again later.",
				},
			]);
			return;
		}

		try {
			const newMessages: Message[] = [
				...messages,
				{ role: "user", content: values.inputTxt },
				{ role: "bot", content: "Analyzing your request..." },
			];

			setMessages(newMessages);
			form.reset();

			const data = isOnchain
				? await fetchExtracts(values.inputTxt)
				: await fetchInfo({
						type: "chat",
						data: portfolioData,
						question: values.inputTxt,
				  });

			if (!data?.length) {
				setMessages([
					...newMessages,
					{
						role: "bot",
						content:
							"No results found. You can search for tokens, swap them, bridge them across chains, and more.",
					},
				]);
				return;
			}

			const action = data[0].action;

			switch (action) {
				case "swap":
					setMessages([
						...newMessages,
						{
							role: "bot",
							content: `Available tokens for swap:\n1. ${data[0].token1}\n2. ${data[0].token2}`,
						},
					]);
					break;

				case "bridge":
					setMessages([
						...newMessages,
						{
							role: "bot",
							content: "Bridge functionality coming soon!",
						},
					]);
					break;

				case "transfer":
					if (!isValidWalletAddress(data[0].address)) {
						throw new Error("Invalid wallet address");
					}

					const result = await handleTransfer(data[0]);

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
					const balance = await handleBalance(data[0]);

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
								"Command not recognized. Try checking balances, making transfers, or exploring other DeFi operations.",
						},
					]);
			}
		} catch (error) {
			console.error("Operation failed:", error);
			setMessages([
				...messages,
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
					<h5 className="text-3xl mx-auto">DeFi Sage</h5>
					<p className="text-lg opacity-80 mx-auto">
						One-Stop Hub for Insights, Chats, and All Things DeFi
					</p>
				</div>
				<div className="flex items-start gap-x-4">
					<Input
						type="text"
						placeholder="Wallet address"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						className="w-64 bg-transparent text-white placeholder-gray-400 border-zinc-800 focus-visible:ring-0 focus-visible:ring-offset-0 ring-0"
					/>
					<div className="flex flex-col justify-center items-center space-y-2">
						<Switch
							id="onchain-mode"
							checked={isOnchain}
							onCheckedChange={setIsOnchain}
							className="data-[state=checked]:bg-[#FF9100] data-[state=unchecked]:bg-[#ffd092]"
						/>
						<Label
							htmlFor="onchain-mode"
							className="text-sm font-medium"
						>
							Onchain
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
							className={`w-full flex items-center gap-4 ${
								role === "user"
									? "justify-end"
									: "justify-start"
							}`}
						>
							{role === "user" ? (
								<div className="flex flex-row-reverse justify-center items-center">
									<div className="p-3 bg-[#3f3f46] rounded-full">
										<User />
									</div>
									<p className="mx-4">{content}</p>
								</div>
							) : (
								<div className="flex mx-4 w-11/12 max-w-7xl items-center">
									<div className="p-3 bg-gradient-to-bl from-[#FF9100] via-[#FF9100] to-[#db00e9] rounded-full">
										<Bot />
									</div>
									<p className="mx-4 bg-[#ff910079] p-2 rounded-lg">
										{content}
									</p>
								</div>
							)}
						</div>
					))}
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-4 sticky bottom-0 w-full z-50"
					>
						<FormField
							control={form.control}
							name="inputTxt"
							render={({ field }) => (
								<FormItem className="w-full">
									<Input
										{...field}
										placeholder="Enter your DeFi query..."
										disabled={portfolioLoading}
										className="w-full mt-auto bg-transparent border-[#444444] focus-visible:ring-0 focus-visible:ring-offset-0 ring-0"
									/>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={portfolioLoading} // Disable while loading
							className={`bg-gradient-to-br from-[#FF9100] via-[#FF9100] to-[#c200e9] rounded-xl ${
								portfolioLoading
									? "opacity-50 cursor-not-allowed"
									: ""
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
