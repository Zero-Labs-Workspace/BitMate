"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, FormField, FormItem } from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import ReactMarkdown from "react-markdown";
import "./markdown-styles.css";
import { useActiveAccount } from "thirdweb/react";
import { Bot, ExternalLink, Send, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidWalletAddress, findToken } from "../../lib/utils";
import {
  getContract,
  prepareTransaction,
  sendTransaction,
  toWei,
} from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { client } from "@/providers/thirdwebProvider";
import { rootstackTestnetChain } from "@/constants/chains";
import { Account, getWalletBalance } from "thirdweb/wallets";
import { isAddress } from "thirdweb/utils";
import { useActiveWallet } from "thirdweb/react";

type Message = {
  role: "user" | "bot";
  content: string | React.ReactNode;
};

const formSchema = z.object({
  inputTxt: z.string().min(2).max(100),
});

const BLOCK_EXPLORER_URL = "https://rootstock-testnet.blockscout.com/tx/";

export default function Page() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const [address, setAddress] = useState("");
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Welcome to DeFi Sage AI! I'm your AI assistant for the Rootstock ecosystem. I can help you send payments using AI, check wallet balances, and provide DeFi strategies. How can I assist you today?",
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputTxt: "",
    },
  });

  const fetchPortfolio = async (walletAddress: string) => {
    try {
      setPortfolioLoading(true);
      const response = await fetch(`/api/wallet/${walletAddress}/portfolio`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error);
      throw error;
    } finally {
      setPortfolioLoading(false);
    }
  };

  useEffect(() => {
    if (account?.address) {
      setAddress(account.address);
      fetchPortfolio(account.address)
        .then(setPortfolioData)
        .catch((error) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              content: "Failed to load portfolio data. Please try again later.",
            },
          ]);
        });
    }
  }, [account?.address]);

  useEffect(() => {
    if (address && isAddress(address)) {
      fetchPortfolio(address).then(setPortfolioData).catch(console.error);
    }
  }, [address]);

  const handleTransfer = async (data: any) => {
    try {
      const tokenAddress =
        data.token1.toLowerCase() === "trbtc"
          ? "trbtc"
          : await findToken(data.token1);

      if (!tokenAddress) throw new Error("Token not found");

      let transaction;
      if (tokenAddress === "trbtc") {
        transaction = prepareTransaction({
          to: data.address,
          chain: rootstackTestnetChain,
          client: client,
          value: toWei(data.amount),
        });
      } else {
        const contract = getContract({
          address: tokenAddress,
          chain: rootstackTestnetChain,
          client,
        });

        transaction = transfer({
          contract,
          to: data.address,
          amount: data.amount,
        });
      }

      return await sendTransaction({
        transaction,
        account: account as Account,
      });
    } catch (error) {
      console.error("Transfer failed:", error);
      throw error;
    }
  };

  const handleBalance = async (data: any) => {
    try {
      const tokenAdd =
        data.token1.toLowerCase() === "trbtc"
          ? "trbtc"
          : await findToken(data.token1);

      if (!tokenAdd && data.token1.toLowerCase() !== "trbtc") {
        throw new Error("Token not found");
      }

      const acc = isAddress(data.address) ? data.address : account?.address;

      return tokenAdd === "trbtc"
        ? await getWalletBalance({
            address: acc,
            client,
            chain: rootstackTestnetChain,
          })
        : await getWalletBalance({
            address: acc,
            tokenAddress: tokenAdd!,
            client,
            chain: rootstackTestnetChain,
          });
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      throw error;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (portfolioLoading) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Please wait while I fetch the portfolio data...",
        },
      ]);
      return;
    }

    // Add user message to chat
    const userMessage = { role: "user" as const, content: values.inputTxt };
    const processingMessage = {
      role: "bot" as const,
      content: "Processing your request...",
    };

    const newMessages = [...messages, userMessage, processingMessage];

    setMessages(newMessages);
    form.reset();

    try {
      // Extract text-only message history for API
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content:
          typeof msg.content === "string"
            ? msg.content
            : "Content not available as string",
      }));

      // Process all requests through the AI endpoint
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          data: portfolioData,
          question: values.inputTxt,
          address: address || account?.address,
          messageHistory: messageHistory,
        }),
      });

      const data = await response.json();

      if (data?.functionCall) {
        const functionData = data.functionCall;

        switch (functionData.name) {
          case "transfer":
            if (!isValidWalletAddress(functionData.arguments.address)) {
              throw new Error("Invalid wallet address");
            }
            const result = await handleTransfer(functionData.arguments);
            setMessages([
              ...newMessages.slice(0, -1),
              {
                role: "bot",
                content: (
                  <div className="w-full">
                    <ReactMarkdown>
                      {data.analysis || "Transaction initiated."}
                    </ReactMarkdown>
                    <div className="flex items-center gap-2 mt-2">
                      <span>Transaction sent: </span>
                      <a
                        href={`${BLOCK_EXPLORER_URL}${result.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        {`${result.transactionHash.slice(
                          0,
                          6
                        )}...${result.transactionHash.slice(-4)}`}
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ),
              },
            ]);
            break;

          case "balance":
            const balance = await handleBalance(functionData.arguments);
            setMessages([
              ...newMessages.slice(0, -1),
              {
                role: "bot",
                content: (
                  <div className="w-full">
                    <ReactMarkdown>
                      {data.analysis || "Balance retrieved."}
                    </ReactMarkdown>
                    <div className="mt-2">
                      Balance: {balance.displayValue} {balance.symbol}
                    </div>
                  </div>
                ),
              },
            ]);
            break;

          default:
            setMessages([
              ...newMessages.slice(0, -1),
              {
                role: "bot",
                content: (
                  <div className="markdown-content space-y-4">
                    <ReactMarkdown>
                      {data.analysis ||
                        "No information available for this query."}
                    </ReactMarkdown>
                  </div>
                ),
              },
            ]);
        }
      } else {
        // Regular AI response (strategy or information)
        setMessages([
          ...newMessages.slice(0, -1),
          {
            role: "bot",
            content: (
              <ReactMarkdown>
                {data.analysis || "No information available for this query."}
              </ReactMarkdown>
            ),
          },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages.slice(0, -1),
        {
          role: "bot",
          content: `Error: ${
            error instanceof Error ? error.message : "Operation failed"
          }`,
        },
      ]);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!wallet) {
    return (
      <div className="h-full flex flex-col gap-y-3 items-center justify-center text-4xl font-bold">
        Connect your wallet
      </div>
    );
  }

  return (
    <div className="h-full max-h-full w-full relative overflow-y-clip">
      <div className="flex items-center justify-between w-full px-6 border-b border-[#444444] py-3">
        <div className="space-y-1.5">
          <h5 className="text-3xl font-bold text-white">DeFi Sage AI</h5>
          <div className="flex flex-col">
            <p className="text-sm text-slate-100 opacity-80">
              Intelligent DeFi Assistant for the Rootstock Ecosystem
            </p>
          </div>
        </div>
      </div>

      <div className="w-[95%] h-[90%] mx-auto flex flex-col">
        <div
          className="flex-1 overflow-y-auto py-10 flex flex-col gap-y-10 px-6"
          ref={containerRef}
        >
          {messages.map(({ role, content }, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 ${
                role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start`}
              >
                <div
                  className={`p-3 ${
                    role === "user"
                      ? "bg-[#3f3f46]"
                      : "bg-gradient-to-bl from-primary to-[#db00e9]"
                  } rounded-full mt-1`}
                >
                  {role === "user" ? <User /> : <Bot />}
                </div>
                <div
                  className={`mx-4 ${
                    role === "user"
                      ? "bg-[#3f3f46] p-4 rounded-lg w-[450px] max-w-[85%] text-white"
                      : "bg-[#27252d] border border-[#ff9100] p-4 rounded-lg w-[550px] max-w-[85%] text-white"
                  }`}
                >
                  {role === "user" ? (
                    <div className="text-right">{content}</div>
                  ) : (
                    content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-4 sticky bottom-0 backdrop-blur-lg mt-0.5 pb-4 px-2"
          >
            <FormField
              control={form.control}
              name="inputTxt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Input
                    {...field}
                    placeholder="Ask about transactions, balances, or strategies for Rootstock"
                    disabled={portfolioLoading}
                    className="w-full bg-transparent border-[#444444] focus-visible:ring-0 outline-none"
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={portfolioLoading}
              className={`bg-gradient-to-br from-primary to-[#c200e9] rounded-xl ${
                portfolioLoading ? "opacity-50" : ""
              }`}
            >
              <Send />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
