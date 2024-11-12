import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export async function findToken(query: string): Promise<string | null> {
	try {
		const tokenLowerCase = query.toLowerCase();

		// Make API call to Blockscout
		const response = await fetch(
			`https://rootstock-testnet.blockscout.com/api/v2/tokens?q=${tokenLowerCase}&type=ERC-20`
		);

		if (!response.ok) {
			throw new Error(`API call failed with status: ${response.status}`);
		}

		const data = await response.json();

		// Check if we have any results
		if (data.items && data.items.length > 0) {
			// Return the address of the first token found
			return data.items[0].address;
		}

		// Return null if no tokens found
		return null;
	} catch (error) {
		console.error("Error fetching token:", error);
		return null;
	}
}
export function isValidWalletAddress(address: string): boolean {
	const regex = /^(0x)?[0-9a-fA-F]{40}$/;

	return regex.test(address);
}

export async function fetchWalletData(address: string) {
	const transactions = await fetch(`/api/wallet/${address}/transactions`);

	return transactions.json();
}

export async function fetchPortfolioData(address: string) {
	const portfolio = await fetch(`/api/wallet/${address}/portfolio`);

	return portfolio.json();
}
