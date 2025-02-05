"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { placeOrder } from "./actions/action";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";

const CartSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Skeleton className="h-8 w-48 mb-8" />
    <div className="space-y-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 border-b pb-4">
          <Skeleton className="w-20 h-20 rounded-md" />
          <div className="flex-grow">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-16 h-9" />
            <Skeleton className="w-20 h-9" />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-8 flex justify-between items-center">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-40" />
    </div>
  </div>
);

export default function CartPage() {
  const { items, removeFromCart, getTotalPrice } = useCart();
  const { update, data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="mb-4">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const handleOrder = async () => {
    toast.loading("Placing order...");
    try {
      const cartState = {
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await placeOrder(cartState);

      if (response.success) {
        const newBalance =
          (session?.user?.balance ?? 0) > getTotalPrice()
            ? (session?.user?.balance ?? 0) - getTotalPrice()
            : 0;

        await update({
          ...session,
          user: {
            ...session?.user,
            balance: newBalance,
          },
        });

        useCart.getState().clearCart();

        toast.success(
          "Order placed successfully. Check your email for confirmation.",
          {
            description: "Thank you for shopping with us!",
            duration: 5000,
          }
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      toast.error("Placing order failed", {
        description: (error as Error)?.message || "Please try again later",
        duration: 5000,
      });
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 border-b pb-4"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-md"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Number.parseInt(e.target.value);
                  if (newQuantity > 0) {
                    useCart.getState().addToCart({
                      ...item,
                      quantity: newQuantity - item.quantity,
                    });
                  }
                }}
                className="w-16"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-semibold">
          Total: ${getTotalPrice().toFixed(2)}
        </p>
        {status === "unauthenticated" ? (
          <Link
            className={buttonVariants({
              variant: "destructive",
            })}
            href={"/sign-in"}
          >
            Sign in to order
          </Link>
        ) : (
          <Button className="w-40" onClick={handleOrder}>
            Order Now
          </Button>
        )}
      </div>
    </div>
  );
}
