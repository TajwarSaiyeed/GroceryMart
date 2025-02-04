"use client";

import type React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/user":
        return "Dashboard";
      case "/user/orders":
        return "My Orders";
      case "/user/purchase":
        return "Purchase History";
      case "/user/shopping-lists":
        return "Shopping Lists";
      case "/user/payment":
        return "Payment";
      case "/user/settings":
        return "Account Settings";
      case "/user/deposit":
        return "Deposit";
      case "/user/deposit/deposit-history":
        return "Deposit History";
      case "/user/wishlist":
        return "Wishlist";
      default:
        return "Dashboard";
    }
  };

  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-full">
          <DashboardSidebar />
          <SidebarInset className="flex-1 w-full">
            <header className="h-16 border-b px-4 flex items-center">
              <SidebarTrigger aria-label="Toggle Sidebar" />
              <h1 className="text-xl font-semibold ml-4">{getPageTitle()}</h1>
            </header>
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
