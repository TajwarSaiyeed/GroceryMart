import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Geist({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroceryMart",
  description:
    "GroceryMart is a grocery store that sells fresh produce and other groceries.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
          geistSans.className,
          geistMono.className
        )}
      >
        <SessionProvider>
          <main className={"relative flex flex-col min-h-screen"}>
            <div className={"flex-grow flex-1"}>
              {children}
              <Toaster richColors />
            </div>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
