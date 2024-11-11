"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, FormField, FormItem } from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { useActiveAccount } from "thirdweb/react";
import { Bot, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isValidWalletAddress, findToken } from "../../lib/utils";
import { getContract, sendTransaction } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { client } from "@/providers/thirdwebProvider";
import { botanixChain } from "@/constants/chains";
import { Account, getWalletBalance } from "thirdweb/wallets";
import { isAddress } from "thirdweb/utils";
import { useActiveWallet } from "thirdweb/react";

const formSchema = z.object({
  inputTxt: z.string().min(2).max(100),
});

export default function Page() {
  const account = useActiveAccount();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "bot",
        content: "Hello! How can I help you today?",
      },
      {
        role: "bot",
        content:
          "You can search for your balance,do transactions and much more.",
      },
    ]
  );
  const wallet = useActiveWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputTxt: "",
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newMessages: { role: string; content: string }[] = [
      ...messages,
      {
        role: "user",
        content: values.inputTxt,
      },
    ];
    setMessages(newMessages);
    form.reset();

    setMessages([
      ...newMessages,
      {
        role: "bot",
        content: "Analyzing your request..",
      },
    ]);

    const data = await fetchExtracts(values.inputTxt);

    if (!data.length) {
      setMessages([
        ...newMessages,
        {
          role: "bot",
          content: "No results found, pls try again",
        },
        {
          role: "bot",
          content:
            "You can search for tokens, swap them, bridge them across many chains, and much more.",
        },
      ]);
      return;
    }

    switch (data[0].action) {
      case "swap":
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: "Here are the tokens you can swap",
          },
          {
            role: "bot",
            content: `1. ${data[0].token1}`,
          },
          {
            role: "bot",
            content: `2. ${data[0].token2}`,
          },
        ]);

        break;
      case "bridge":
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: "Coming soon!",
          },
        ]);
        break;
      case "transfer":
        if (!isValidWalletAddress(data[0].address)) {
          setMessages([
            ...newMessages,
            {
              role: "bot",
              content: "Invalid address, pls try again",
            },
          ]);
          return;
        }
        const tokenAddress = findToken(data[0].token1);
        if (!tokenAddress) {
          setMessages([
            ...newMessages,
            {
              role: "bot",
              content: "Token not found, pls try again",
            },
          ]);
          return;
        }
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: `You are trasfering ${data[0].amount} ${data[0].token1} to ${data[0].address}`,
          },
        ]);

        const contract = getContract({
          address: tokenAddress,
          chain: botanixChain,
          client,
        });

        const transaction = transfer({
          contract,
          to: data[0].address,
          amount: data[0].amount,
        });

        const transactionResult = await sendTransaction({
          transaction,
          account: account as Account,
        });

        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: `Transaction sent: ${transactionResult.transactionHash}`,
          },
        ]);
        break;
      case "balance":
        const tokenAdd = findToken(data[0].token1);
        if (!tokenAdd && data[0].token1.toLowerCase() !== "btc") {
          setMessages([
            ...newMessages,
            {
              role: "bot",
              content: "Token not found, pls try again",
            },
          ]);
          return;
        }
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: `Checking balance of ${data[0].token1}`,
          },
        ]);

        const acc = isAddress(data[0].address)
          ? data[0].address
          : account?.address;

        const balance = await getWalletBalance({
          address: acc,
          tokenAddress: tokenAdd ?? undefined,
          client,
          chain: botanixChain,
        });

        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: `Balance of ${acc} is ${balance.displayValue} ${balance.symbol}`,
          },
        ]);
        break;
      default:
        setMessages([
          ...newMessages,
          {
            role: "bot",
            content: "No results found, pls try again",
          },
          {
            role: "bot",
            content:
              "You can search for balance,do transactions and much more.",
          },
        ]);
    }
  };

  const fetchExtracts = async (query: string) => {
    const response = await fetch(`/api/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: query }),
    });
    const data = await response.json();
    return data.result.completion;
  };

  return (
    <>
      {!wallet ? (
        <div className="h-full flex flex-col gap-y-3 items-center justify-center text-4xl font-bold">
          Connect your wallet
        </div>
      ) : (
        <div className="h-full max-h-full w-full relative overflow-y-clip">
          <div className="space-y-1.5 px-6 border-b border-[#444444] py-3">
            <h5 className="text-3xl mx-auto">Send transactions</h5>
            <p className="text-lg opacity-80  mx-auto">
              Send transactions, check your balance, and much more.
            </p>
          </div>
          <div className="w-[98%] h-[90%] mx-auto flex flex-col">
            <div
              className="flex-1 overflow-scroll py-10 space-y-10"
              ref={containerRef}
            >
              {messages.map(({ role, content }, index) => (
                <div
                  key={index}
                  className={`w-full flex items-center gap-4 ${
                    role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {role === "user" ? (
                    <div className="flex flex-row-reverse justify-center items-center">
                      <div className="p-3 bg-[#3f3f46] rounded-full">
                        <User />
                      </div>
                      <p className="mx-4">{content}</p>
                    </div>
                  ) : (
                    <div className="flex mx-4 w-11/12 max-w-7xl items-center">
                      <div className="p-3 bg-blue-500 rounded-full">
                        <Bot />
                      </div>
                      <p className="mx-4">{content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-4 mto sticky bottom-0 w-full z-50"
              >
                <FormField
                  control={form.control}
                  name="inputTxt"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Input
                        {...field}
                        placeholder="Search here..."
                        className="w-full mt-auto  bg-transparent border-[#444444] focus-visible:ring-0 focus-visible:ring-offset-0 ring-0"
                      />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 rounded-xl"
                >
                  Search
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
