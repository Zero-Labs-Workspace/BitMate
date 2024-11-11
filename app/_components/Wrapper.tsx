"use client";
import { Provider } from "@/providers/thirdwebProvider";
import React from "react";
import SideBar from "./SideBar";

export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <div className="flex w-full h-screen py-4">
        <SideBar />
        <div className="rounded-2xl flex-1 w-full">
          <div className="w-[98%] h-full overflow-auto py-4 bg-[#18181B] rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    </Provider>
  );
}
