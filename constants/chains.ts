import { defineChain } from "thirdweb";

export const botanixChain = defineChain({
  id: 3636,
  testnet: true,
  name: "Botanix Testnet",
  nativeCurrency: { name: "Bitcoin", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node.botanixlabs.dev"] },
  },
  blockExplorers: {
    default: {
      name: "Botanix explorer",
      url: "https://blockscout.botanixlabs.dev/",
    },
  },
});
