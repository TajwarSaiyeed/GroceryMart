"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/logout";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const { data: session, status } = useSession();

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
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200 flex items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">
                Grocery Mart
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <NavbarSkeleton />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src="/avatar.png" alt="User avatar" />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      {session.user?.name || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/user">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-500"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

const NavbarSkeleton = () => (
  <div className="flex items-center gap-2">
    <Skeleton className="h-9 w-[70px]" />
    <Skeleton className="h-9 w-[80px]" />
  </div>
);

export default Navbar;
