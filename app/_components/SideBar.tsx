"use client";
import {
  BotMessageSquare,
  Box,
  Cog,
  CreditCard,
  Gamepad2,
  Home,
  Search,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { embeddedWallet, injectedProvider } from "thirdweb/wallets";
import { client } from "@/providers/thirdwebProvider";
import { FACTORY_ADDRESS_CONTRACT } from "@/constants/contracts";
import { rootstackTestnetChain } from "@/constants/chains";
import Image from "next/image";

export default function SideBar() {
  const pathname = usePathname();
  return (
    <div className="w-full max-w-96 h-full">
      <div className="space-y-5 w-10/12 mx-auto h-full flex flex-col items-stretch">
        <div className="max-w-[11.5rem] pl-4 py-3">
          <Image
            src="logo.svg"
            alt="alt"
            width={500}
            height={500}
            className="w-full"
          />
        </div>
        {[
          {
            name: "Dashboard",
            href: "/",
            color: "text-white/70",
            icon: <Home />,
          },
          // {
          // 	name: "Ask AI",
          // 	href: "/search",
          // 	icon: <Search />,
          // },
          {
            name: "Send Transaction",
            href: "/modal",

            icon: <BotMessageSquare />,
          },
          {
            name: "Play Games",
            href: "/games",
            icon: <Gamepad2 />,
          },
        ].map((e) => (
          <Link
            href={e.href}
            key={e.name}
            className={`flex items-center gap-x-2.5 hover:bg-gradient-to-r from-[#FF9100] via-[#FF9100] to-[#e900ab] rounded-lg px-3 py-2.5 group ${
              pathname === e.href
                ? "bg-gradient-to-r from-[#FF9100] via-[#FF9100] to-[#e900ab]"
                : ""
            }`}
          >
            <div
              className={`${
                pathname === e.href
                  ? "text-white"
                  : "text-[#FF9100] group-hover:text-white "
              }`}
            >
              {e.icon}
            </div>
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
            chain={rootstackTestnetChain}
            wallets={[embeddedWallet()]}
          />
        </div>
      </div>
    </div>
  );
}
