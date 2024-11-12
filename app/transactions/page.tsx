"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { Card } from "../_components/ui/card";
import { useActiveAccount } from "thirdweb/react";

// Define types
interface TokenInfo {
	symbol: string;
}

interface AddressInfo {
	hash: string;
}

interface TokenTransfer {
	total: {
		value: string;
	};
	token?: TokenInfo;
	from: AddressInfo;
	to: AddressInfo;
}

interface Transaction {
	hash: string;
	status: "ok" | "error" | "pending";
	timestamp: string;
	method: string;
	value: string;
	gas_used: string;
	token_transfers?: TokenTransfer[];
}

interface TransactionResponse {
	items: Transaction[];
}

// Utility functions
const formatHash = (hash: string): string => `${hash.slice(0, 10)}...`;

const formatValue = (value: string): string | number => {
	if (value === "0") return "0";
	return (parseFloat(value) / 1e18).toFixed(6);
};

// StatusBadge component
const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
	const statusStyles = {
		ok: "bg-green-500/10 text-green-500",
		error: "bg-red-500/10 text-red-500",
		pending: "bg-gray-500/10 text-gray-500",
	};

	return (
		<span
			className={`text-xs px-2 py-0.5 rounded-full ${
				statusStyles[status] || statusStyles.pending
			}`}
		>
			{status}
		</span>
	);
};

// TokenTransferList component
const TokenTransferList = ({ transfers }: { transfers: TokenTransfer[] }) => {
	if (!transfers.length) return null;

	return (
		<div className="mt-4 pl-12">
			<div className="p-4 bg-gray-100/5 rounded-lg">
				<div className="text-sm font-medium mb-2">Token Transfers</div>
				{transfers.map((transfer, index) => (
					<div key={index} className="text-sm text-gray-500">
						{transfer.total.value}{" "}
						{transfer.token?.symbol || "Unknown Token"} from{" "}
						{formatHash(transfer.from.hash)} to{" "}
						{formatHash(transfer.to.hash)}
					</div>
				))}
			</div>
		</div>
	);
};

// Main TransactionsList component
const TransactionsList = () => {
	const activeAccount = useActiveAccount();
	const addressHash = activeAccount?.address; // Extract address here

	const { data, isLoading, error } = useQuery<TransactionResponse>({
		queryKey: ["all-transactions", addressHash],
		queryFn: async () => {
			const response = await fetch(
				`https://rootstock-testnet.blockscout.com/api/v2/addresses/${addressHash}/transactions`
			);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch transactions: ${response.statusText}`
				);
			}
			return response.json();
		},
		staleTime: 30000,
		enabled: !!addressHash,
	});

	if (isLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
			</div>
		);
	}

	// If there’s an error, no data, or an empty list, show "No data found"
	if (error || !data || data.items.length === 0) {
		return (
			<div className="h-full flex items-center justify-center text-gray-500">
				<AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
				No data found
			</div>
		);
	}

	const transactions = data.items;

	return (
		<div className="w-[98%] py-4 mx-auto flex flex-col gap-y-4">
			{transactions.map((tx: Transaction) => (
				<Card
					key={tx.hash}
					className="overflow-hidden bg-transparent text-white"
				>
					<div className="p-4">
						<div className="flex items-start justify-between w-full">
							<div className="flex flex-col gap-y-2 w-full">
								<div className="flex items-center gap-2">
									<span className="font-mono text-sm">
										{formatHash(tx.hash)}
									</span>
									<StatusBadge status={tx.status} />
								</div>
								<div className="text-sm text-gray-500 mt-1">
									{new Date(tx.timestamp).toLocaleString()}
								</div>
							</div>
							<div className="flex w-full justify-between">
								<div className="text-sm">
									<span className="text-gray-500">
										Method:{" "}
									</span>
									{tx.method || "Contract Interaction"}
								</div>
								<div className="text-sm">
									<span className="text-gray-500">
										Value:{" "}
									</span>
									{formatValue(tx.value)} ETH
								</div>
								{tx.gas_used && (
									<div className="text-sm">
										<span className="text-gray-500">
											Gas Used:{" "}
										</span>
										{tx.gas_used}
									</div>
								)}
							</div>
						</div>

						{tx.token_transfers && (
							<TokenTransferList transfers={tx.token_transfers} />
						)}
					</div>
				</Card>
			))}
		</div>
	);
};

const SmartTransactions = () => {
	return (
		<div className="h-full max-h-full w-full relative">
			<div className="flex items-center justify-between w-full px-6 border-b border-[#444444] py-3">
				<h5 className="text-3xl">Transactions</h5>
			</div>
			<TransactionsList />
		</div>
	);
};

export default SmartTransactions;
