"use client";
import React, { useState } from "react";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  History,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";

const SmartTransactions = () => {
  const [transactions] = useState([
    {
      hash: "0x2958d1a5...",
      method: "0xcbf83a04",
      status: "error",
      timestamp: "2024-11-11T22:29:56.000000Z",
      to: "0x45EDa601198dB28413Fa7653300c52D5e4Db9B8B",
      value: "0",
      // AI-generated analysis
      aiAnalysis: {
        type: "Oracle Interaction",
        purpose: "Price Feed Update",
        error: "Block number mismatch",
        pattern: "Regular Oracle Updates",
        risk: "Low",
      },
    },
    {
      hash: "0xe51bfac2...",
      method: "0xcbf83a04",
      status: "error",
      timestamp: "2024-11-11T22:28:56.000000Z",
      to: "0x39192498fCf1dbE11653040Bb49308e09A1056aC",
      value: "0",
      aiAnalysis: {
        type: "BTC/USD Oracle",
        purpose: "Price Update",
        error: "Timing Error",
        pattern: "High Frequency Updates",
        risk: "Low",
      },
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* AI Overview Card */}
      <Card className="border-2 border-[#FF9100]/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#FF9100] to-[#e900ab]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">
                Transaction Pattern Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-sm font-medium">Primary Activity</div>
                  <div className="text-lg">Oracle Updates</div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-lg">76%</div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <div className="text-sm font-medium">Avg Gas Used</div>
                  <div className="text-lg">92,740 gas</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      tx.status === "error"
                        ? "bg-red-500/20"
                        : "bg-green-500/20"
                    }`}
                  >
                    {tx.status === "error" ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{tx.hash}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.status === "error"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-green-500/20 text-green-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button className="text-[#FF9100] hover:text-[#e900ab] transition-colors">
                  View Details
                </button>
              </div>

              {/* AI Analysis Section */}
              <div className="mt-4 pl-12">
                <div className="p-4 bg-gradient-to-r from-[#FF9100]/5 to-[#e900ab]/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-[#FF9100]" />
                    <span className="font-medium">AI Analysis</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Transaction Type</div>
                      <div className="font-medium">{tx.aiAnalysis.type}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Purpose</div>
                      <div className="font-medium">{tx.aiAnalysis.purpose}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Risk Level</div>
                      <div className="font-medium">{tx.aiAnalysis.risk}</div>
                    </div>
                    {tx.status === "error" && (
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Error: {tx.aiAnalysis.error}</span>
                        </div>
                      </div>
                    )}
                    <div className="col-span-full">
                      <div className="text-gray-500">Pattern</div>
                      <div className="font-medium">{tx.aiAnalysis.pattern}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Smart Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Transaction Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-blue-500/20 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Activity Pattern
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Regular oracle price updates with 1-minute intervals. This
                wallet appears to be an automated oracle feeder.
              </p>
            </div>
            <div className="p-4 border border-yellow-500/20 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Common Issues
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Most errors are due to block number mismatches, suggesting
                timing synchronization issues.
              </p>
            </div>
            <div className="p-4 border border-green-500/20 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-green-500" />
                Recommendations
              </h3>
              <ul className="text-sm text-gray-500 mt-1 space-y-2">
                <li>
                  • Consider implementing retry mechanism for failed updates
                </li>
                <li>
                  • Monitor block confirmation times for better synchronization
                </li>
                <li>• Add error handling for block number mismatches</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTransactions;
