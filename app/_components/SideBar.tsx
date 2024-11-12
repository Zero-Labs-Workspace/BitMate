"use client";
import {
  LayoutDashboard,
  Brain,
  TrendingUp,
  History,
  Settings,
  ArrowRightLeft,
  Users,
  Flame,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { embeddedWallet } from "thirdweb/wallets";
import { client } from "@/providers/thirdwebProvider";
import { rootstackTestnetChain } from "@/constants/chains";
import Image from "next/image";

export default function SideBar() {
  const pathname = usePathname();

  const mainMenuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard />,
      description: "Portfolio Overview",
    },
    {
      name: "DeFi Sage",
      href: "/sage",
      icon: <Brain />,
      description: "AI-Powered Insights",
      isAI: true,
      pulsingDot: true,
    },
    {
      name: "Markets",
      href: "/markets",
      icon: <TrendingUp />,
      description: "Trending & Analysis",
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: <History />,
      description: "History & Pending",
    },
  ];

  const toolsMenuItems = [
    {
      name: "Bridge",
      href: "https://powpeg.testnet.rootstock.io/",
      icon: <ArrowRightLeft />,
      description: "BTC ⇄ RBTC Bridge",
      isExternal: true,
    },
    {
      name: "Rootstock Collective",
      href: "https://rootstockcollective.com",
      icon: <Users />,
      description: "Join Bitcoin DAO & Build",
      isExternal: true,
      isNew: true,
    },
  ];

  const MenuItem = ({
    item,
  }: {
    item: {
      name: string;
      href: string;
      icon: React.ReactNode;
      description: string;
      isAI?: boolean;
      isExternal?: boolean;
      isNew?: boolean;
    };
  }) => (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-x-2.5 hover:bg-gradient-to-r from-[#FF9100] via-[#FF9100] to-[#e900ab] rounded-lg px-3 py-2.5 ${
        pathname === item.href
          ? "bg-gradient-to-r from-[#FF9100] via-[#FF9100] to-[#e900ab]"
          : ""
      } ${item.isAI ? "border border-[#FF9100]/20" : ""}`}
    >
      <div
        className={`${
          pathname === item.href
            ? "text-white"
            : "text-[#FF9100] group-hover:text-white"
        }`}
      >
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">{item.name}</span>
          {item.isAI && <div className="flex items-center gap-1"></div>}
        </div>
        <div className="text-xs text-white/50 group-hover:text-white/70">
          {item.description}
        </div>
        {item.isAI && (
          <div className="absolute -right-2 -top-2 transform rotate-12">
            <div className="relative">
              <span className="absolute -inset-0.5 bg-gradient-to-r from-[#FF9100] to-[#e900ab] rounded blur-sm opacity-30 animate-pulse"></span>
              <span className="relative flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#18181B] text-[#FF9100] rounded-full border border-[#FF9100]/30">
                <Flame size={10} />
                Hot
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div className="w-full max-w-96 h-full">
      <div className="space-y-5 w-10/12 mx-auto h-full flex flex-col items-stretch">
        {/* Logo */}
        <div className="max-w-[11.5rem] pl-4 py-3">
          <Image
            src="logo.svg"
            alt="DeFi Sage"
            width={500}
            height={500}
            className="w-full"
          />
        </div>

        {/* Main Menu */}
        <div className="space-y-1">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </div>

        {/* Tools Section */}
        <div className="mt-8">
          <div className="text-sm text-white/50 px-3 mb-2 flex items-center justify-between">
            <span>Quick Access</span>
            <span className="text-xs bg-[#27272A] px-2 py-0.5 rounded-full">
              External
            </span>
          </div>
          <div className="space-y-1">
            {toolsMenuItems.map((item) => (
              <MenuItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Settings Quick Access */}
        <Link
          href="/"
          className="flex items-center gap-x-2.5 text-white/70 hover:text-white px-3 py-2.5 mb-4"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>

        {/* Connect Wallet Button */}
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
