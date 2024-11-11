import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Provider } from "@/providers/thirdwebProvider";
import SideBar from "./_components/SideBar";
import Wrapper from "./_components/Wrapper";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Botanix AI",
  description: "Botanix AI - Built for spiderhacks hackathon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bricolage.className}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
