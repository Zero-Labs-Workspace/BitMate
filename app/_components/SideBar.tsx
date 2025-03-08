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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Toggle } from "./ui/toggle";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
      className={`group relative flex items-center gap-x-2.5 hover:bg-gradient-to-r from-primary via-primary to-[#e900ab] rounded-lg px-3 py-2.5 ${
        pathname === item.href
          ? "bg-gradient-to-r from-primary via-primary to-[#e900ab]"
          : ""
      } ${item.isAI ? "border border-primary/20" : ""}`}
    >
      <div
        className={`${
          pathname === item.href
            ? "text-white"
            : "text-primary group-hover:text-white"
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
              <span className="absolute -inset-0.5 bg-gradient-to-r from-primary to-[#e900ab] rounded blur-sm opacity-30 animate-pulse"></span>
              <span className="relative flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-[#18181B] text-primary rounded-full border border-primary/30">
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
    <div className="w-full max-w-80 h-full">
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

        <div className="flex-1" />

        {/* Settings Quick Access */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-x-2.5 text-white/70 hover:text-white px-3 py-2.5 mb-4">
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#18181B] border-[#6C6C6C]">
            <DialogTitle className="text-3xl font-bold">Settings</DialogTitle>
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-lg font-normal">
                  Allow BitMate to manage assets
                </h6>
                <p className="text-sm text-white/50 font-thin">
                  Activate if you want the agent to make actions for you.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-lg font-normal">
                  Add a max spending allowance{" "}
                </h6>
                <p className="text-sm text-white/50 font-thin">
                  This will be the maximum amount BitMate would be able to
                  manage for you.
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between bg-[#18181B] p-2">
              <div className="flex items-center justify-between w-full pr-2 bg-[#27272A] rounded-lg">
                <Input
                  type="text"
                  className="bg-transparent border-none ring-none  focus:outline-none focus:ring-0 focus-visible:ring-none"
                  placeholder="0000"
                />
                <span className="text-white ml-2 font-thin">RBTC</span>
              </div>
              <Button className="bg-primary hover:bg-primary/80 text-black/80 px-4 py-2 rounded ml-2">
                Approve
              </Button>
            </div>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button
                  variant={"ghost"}
                  className="text-white/60 hover:bg-white/10 hover:text-white"
                >
                  Back
                </Button>
              </DialogClose>
              <Button className="bg-primary hover:bg-primary/80 text-black/80 px-4 py-2 rounded ml-2">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
            wallets={[
              embeddedWallet({
                auth: {
                  options: [
                    "apple",
                    "wallet",
                    "passkey",
                    "google",
                    "guest",
                    "email",
                    "facebook",
                  ],
                },
              }),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
