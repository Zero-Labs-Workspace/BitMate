"use client";

// import { useConnect, useSwitchChain } from "wagmi";
import { Button } from "./_components/ui/button";
import {
  Cog,
  CreditCard,
  Search,
  ArrowRight,
  Box,
  Orbit,
  BotMessageSquare,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-center font-black text-5xl">
            Unlock the power of web3.
          </h1>
          <h2 className="text-center opacity-80 text-2xl max-w-3xl">
            Search information, execute transactions, and deploy smart contracts
            by chatting with Botanium AI.
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Ask Botanium AI",
              desc: "Explore the web3 ecosystem and find the resources that you need.",
              href: "/",
              color: "text-blue-400 bg-blue-700",
              icon: <Search />,
            },
            {
              name: "Send Transaction",
              desc: "Send transactions, check your balance, and much more.",
              href: "/modal",
              color: "text-green-500 bg-green-700",

              icon: <BotMessageSquare />,
            },
            {
              name: "Botanium AI NFTs",
              desc: "Grad your Botanium AI NFTs.",
              href: "/nfts",
              color: "text-purple-500 bg-purple-700",

              icon: <Box />,
            },
          ].map((e) => (
            <div className="flex items-center justify-between gap-x-4 gap-y-4 border-[1px] border-[#2b2b2b] p-4 rounded-lg">
              <div className={`${e.color} p-3 rounded-lg`}>{e.icon}</div>
              <div className="flex flex-col">
                <h6 className="text-xl">{e.name}</h6>
                <p className="text-gray-400">{e.desc}</p>
              </div>
              <div className="flex-1">
                <ArrowRight className="text-gray-600 float-end" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
