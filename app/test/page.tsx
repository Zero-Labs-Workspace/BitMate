"use client";
import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Activity,
  PieChart,
  Shield,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../_components/ui/card";

const DeFiAdvisor = () => {
  // Sample data - would come from your API/blockchain
  const [portfolioData] = useState([
    { date: "Jan", value: 1000 },
    { date: "Feb", value: 1200 },
    { date: "Mar", value: 1100 },
    { date: "Apr", value: 1400 },
    { date: "May", value: 1800 },
  ]);

  const [tokens] = useState([
    { name: "RBTC", balance: "0.5", value: "$21,000", change: "+5.2%" },
    { name: "RSK", balance: "1000", value: "$1,200", change: "-2.1%" },
  ]);

  const [trendingProjects] = useState([
    { name: "Sovryn", category: "DEX", momentum: 92 },
    { name: "Money on Chain", category: "Stablecoin", momentum: 88 },
    { name: "RSKSwap", category: "AMM", momentum: 85 },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DeFi Sage Dashboard</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Wallet size={20} />
          Connect Wallet
        </button>
      </div>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Token Holdings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart size={20} />
              Your Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokens.map((token, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-bold">{token.name}</div>
                    <div className="text-sm text-gray-600">
                      {token.balance} tokens
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{token.value}</div>
                    <div
                      className={
                        token.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {token.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Trending Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingProjects.map((project, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-bold">{project.name}</div>
                    <div className="text-sm text-gray-600">
                      {project.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-500">
                      {project.momentum} Score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Advisor Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={20} />
            DeFi Sage Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Portfolio Analysis */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">Portfolio Analysis</h3>
              <p className="text-sm text-gray-600">
                Based on your recent transactions, you're heavily positioned in
                DeFi lending. Consider diversifying into DEX liquidity provision
                for better yield optimization.
              </p>
            </div>

            {/* Market Opportunities */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold mb-2">Current Opportunities</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="text-green-500" size={16} />
                  RSK-ETH bridge liquidity pools showing 15% APY
                </li>
                <li className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={16} />
                  New Sovryn stability pool launched with 12% APY
                </li>
              </ul>
            </div>

            {/* Risk Alerts */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold mb-2">Risk Alerts</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Shield className="text-yellow-500" size={16} />
                  Your current collateral ratio is close to liquidation.
                  Consider adding more collateral.
                </li>
              </ul>
            </div>

            {/* Action Center */}
            <div className="flex gap-4 mt-4">
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                <Activity size={20} />
                Execute Recommended Trades
              </button>
              <button className="flex-1 border border-blue-500 text-blue-500 px-4 py-2 rounded-lg">
                View Detailed Analysis
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeFiAdvisor;
