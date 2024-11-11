"use client";
import {
  BotMessageSquare,
  Box,
  Cog,
  CreditCard,
  Home,
  Image,
  Search,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { embeddedWallet, injectedProvider } from "thirdweb/wallets";
import { client } from "@/providers/thirdwebProvider";
import { FACTORY_ADDRESS_CONTRACT } from "@/constants/contracts";
import { botanixChain } from "@/constants/chains";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <div className="w-full max-w-96 h-full">
      <div className="space-y-5 w-10/12 mx-auto h-full flex flex-col items-stretch">
        <h5 className="text-4xl p-4 font-semibold text-[#FFB72D]">Botanium</h5>
        {[
          {
            name: "Home",
            href: "/",
            color: "text-white/70",
            icon: <Home />,
          },
          {
            name: "Ask AI",
            href: "/search",
            color: "text-blue-500",
            icon: <Search />,
          },
          {
            name: "Send Transaction",
            href: "/modal",
            color: "text-green-500",

            icon: <BotMessageSquare />,
          },
          // {
          //   name: "Deploy Contract",
          //   href: "/deploy",
          //   color: "text-purple-500",

          //   icon: <Box />,
          // },
          {
            name: "Botanium AI NFTs",
            href: "/nfts",
            color: "text-purple-500",

            icon: <Box />,
          },
          {
            name: "Settings",
            href: "/settings",
            color: "text-[#FFB72D]",

            icon: <Cog />,
          },
        ].map((e) => (
          <Link
            href={e.href}
            key={e.name}
            className={`flex items-center gap-x-2.5 hover:bg-[#27272A]/60 rounded-lg px-3 py-2.5 ${
              pathname === e.href ? "bg-[#27272A]" : ""
            }`}
          >
            <div className={`${e.color}`}>{e.icon}</div>
            <div>{e.name}</div>
          </Link>
        ))}
        <div className="flex-1" />
        <div className="w-full bg-[#27272A] rounded-lg p-3 py-3.5 text-center flex justify-center">
          <ConnectButton
            theme={darkTheme({
              colors: {
                primaryButtonBg: "#18181B",
                primaryButtonText: "#f0f0f0",
                selectedTextBg: "#18181b",
              },
            })}
            autoConnect={true}
            client={client}
            chain={botanixChain}
            wallets={[embeddedWallet()]}
          />
        </div>
      </div>
    </div>
  );
}
