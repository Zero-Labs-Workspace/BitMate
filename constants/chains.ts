import { defineChain } from "thirdweb";

export const rootstackTestnetChain = defineChain({
  id: 31,
  testnet: true,
  name: "Rootstock Testnet",
  nativeCurrency: {
    name: "Testnet Smart Bitcoin",
    symbol: "tRBTC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://public-node.testnet.rsk.co"] },
  },
  blockExplorers: {
    default: {
      name: "Rootstock explorer",
      url: "https://explorer.testnet.rootstock.io/",
    },
  },
});

export const bobSeploiaChain = defineChain({
  id: 808813,
  testnet: true,
  name: "Bob Seploia",
  nativeCurrency: {
    name: "Bob Seploia",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://bob-sepolia.rpc.gobob.xyz/"] },
  },
  blockExplorers: {
    default: {
      name: "Bob Seploia explorer",
      url: "https://bob-sepolia.explorer.gobob.xyz/",
    },
  },
});
