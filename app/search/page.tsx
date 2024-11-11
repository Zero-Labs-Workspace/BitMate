//@ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, FormField, FormItem } from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { Button } from "../_components/ui/button";
import { Bot, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useActiveWallet } from "thirdweb/react";

const formSchema = z.object({
  inputTxt: z.string().min(2).max(50),
});

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "bot",
        content: "Hello! How can I help you today?",
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
      ]);
      return;
    }
    setMessages([
      ...newMessages,
      {
        role: "bot",
        content: data,
      },
    ]);
    return;
  };

  const fetchExtracts = async (query: string) => {
    const response = await fetch(`/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: query }),
    });
    const data = await response.json();
    return data.result.text;
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
            <h5 className="text-3xl mx-auto">Ask Botanium AI</h5>
            <p className="text-lg opacity-80  mx-auto">
              Explore the Bonatix Ecosystem and find the resources that you need
            </p>
          </div>
          <div className="w-[98%] h-[90%] mx-auto flex flex-col">
            {/* <div className="flex-1 overflow-scroll py-8 space-y-10"> */}
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
                    <div className="flex mx-4 w-11/12 max-w-5xl items-center">
                      <div className="p-3 bg-blue-500 rounded-full">
                        <Bot />
                      </div>
                      <p className="mx-4 ">{content}</p>
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
