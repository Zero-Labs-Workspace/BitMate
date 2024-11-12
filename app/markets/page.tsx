"use client";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity, ExternalLink, Loader2 } from "lucide-react";

import { projects } from "@/constants/market";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../_components/ui/card";
import Link from "next/link";
import Image from "next/image";

const formatTVL = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const ProjectCard = ({ project }: { project: any }) => (
  <Card className="bg-[#27272A] border-zinc-800 hover:border-zinc-700 transition-colors">
    <CardContent className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-[80px] h-[80px]">
          <Image
            src={`https://icons.llamao.fi/icons/protocols/${project?.slug}?w=80&h=80`}
            alt={project?.name}
            width={80}
            height={80}
            className="rounded-lg bg-[#1C1C1F]"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {project?.name}
              </h3>
              <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-[#FF9100]/10 text-[#FF9100] mb-2">
                {project?.category}
              </span>
              <p className="text-sm text-white/70 line-clamp-2 mb-4">
                {project?.description}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-white/50">TVL</p>
                  <p className="text-white font-semibold">{project?.tvl}</p>
                </div>
                {project?.change_1m && (
                  <div>
                    <p className="text-sm text-white/50">30d Change</p>
                    <p
                      className={`font-semibold ${
                        project?.change_1m.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {project?.change_1m}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {project.url && (
              <Link
                href={project?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white"
              >
                <ExternalLink size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TVLDashboard = () => {
  const [tvlData, setTvlData] = useState([]);
  const [loading, setLoading] = useState(true);
  type Timeframe = "1m" | "3m" | "1y" | "all";
  const [timeframe, setTimeframe] = useState<Timeframe>("3m");
  const [currentTVL, setCurrentTVL] = useState(0);

  useEffect(() => {
    const fetchTVLData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.llama.fi/v2/historicalChainTvl/Rootstock"
        );
        const data = await response.json();

        const now = Date.now() / 1000;
        const timeranges = {
          "1m": now - 30 * 24 * 60 * 60,
          "3m": now - 90 * 24 * 60 * 60,
          "1y": now - 365 * 24 * 60 * 60,
          all: 0,
        };

        const filteredData = data
          .filter(
            (item: { date: number }) => item.date >= timeranges[timeframe]
          )
          .map((item: { date: any; tvl: any }) => ({
            date: item.date,
            tvl: item.tvl,
          }));

        setTvlData(filteredData);
        setCurrentTVL(filteredData[filteredData.length - 1]?.tvl || 0);
      } catch (error) {
        console.error("Error fetching TVL data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVLData();
  }, [timeframe]);

  const timeframeButtons = [
    { label: "1M", value: "1m" },
    { label: "3M", value: "3m" },
    { label: "1Y", value: "1y" },
    { label: "ALL", value: "all" },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#18181B] min-h-screen">
      <Card className="bg-[#27272A] border-zinc-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Rootstock Ecosystem Overview
              </CardTitle>
              <CardDescription className="text-slate-100">
                Total Value Locked and DeFi Protocol Analytics
              </CardDescription>
            </div>
            <div className="bg-[#1C1C1F] p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="text-[#FF9100]" size={20} />
                <p className="text-sm text-white/50">Current TVL</p>
              </div>
              <p className="text-2xl font-bold text-white mt-1">
                {formatTVL(currentTVL)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {" "}
            {/* Reduced from 400px to 300px */}
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF9100]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tvlData}>
                  <defs>
                    <linearGradient
                      id="tvlGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FF9100" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#FF9100" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#666"
                    tick={{ fill: "#fff" }}
                    tickFormatter={(value) =>
                      new Date(value * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: "#fff" }}
                    tickFormatter={formatTVL}
                  />
                  <Area
                    type="monotone"
                    dataKey="tvl"
                    stroke="#FF9100"
                    strokeWidth={2}
                    fill="url(#tvlGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            {timeframeButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setTimeframe(button.value as Timeframe)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  timeframe === button.value
                    ? "bg-[#FF9100] text-white"
                    : "bg-[#1C1C1F] text-white/70 hover:bg-[#323232]"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default TVLDashboard;
