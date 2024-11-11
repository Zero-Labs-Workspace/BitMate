import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tokens } from "../constants/tokens";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function findToken(query: string): string | null {
  const queryLowerCase = query.toLowerCase();
  for (const token of tokens) {
    if (
      token.name.toLowerCase() === queryLowerCase ||
      token.symbol.toLowerCase() === queryLowerCase
    ) {
      return token.address;
    }
  }
  return null;
}
export function isValidWalletAddress(address: string): boolean {
  const regex = /^(0x)?[0-9a-fA-F]{40}$/;

  return regex.test(address);
}
