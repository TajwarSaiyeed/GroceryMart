"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Banknote,
  Home,
  HeartIcon,
  CreditCard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { logout } from "@/actions/logout";
import { signOut } from "next-auth/react";

export function DashboardSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();

      signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-2">
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          <span className="text-lg font-bold">GroceryMart</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user/orders" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user/purchase" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user/purchase">
                <CreditCard className="mr-2 h-4 w-4" />
                Purchase History
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user/wishlist" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user/wishlist">
                <HeartIcon className="mr-2 h-4 w-4" />
                Wishlist
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user/deposit" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user/deposit">
                <Banknote className="mr-2 h-4 w-4" />
                Deposit
              </Link>
            </SidebarMenuButton>
            <SidebarMenuSub
              className={cn(
                "",
                pathname === "/user/deposit/deposit-history" &&
                  "bg-green-100 text-green-700"
              )}
            >
              <SidebarMenuSubItem>
                <Link href="/user/deposit/deposit-history">
                  Deposit History
                </Link>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "w-full justify-start",
                pathname === "/user/settings" && "bg-green-100 text-green-700"
              )}
            >
              <Link href="/user/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
