"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative py-12 md:py-24 lg:py-32 my-5 rounded-xl overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/banner.jpg"
          alt="Fresh produce and groceries"
          className="h-full w-full object-cover"
          layout="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-r to-black from-transparent opacity-70"></div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-end px-4 sm:px-6 lg:px-8">
        <div className="text-right max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
            Welcome to GroceryMart
          </h1>
          <p className="mt-4 max-w-[600px] text-white/90 text-lg sm:text-xl">
            Discover fresh, quality groceries at unbeatable prices. Shop smart,
            eat well, and save more with GroceryMart.
          </p>
          <div className="flex flex-wrap justify-end gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/products" prefetch={false}>
                Shop Now
              </Link>
            </Button>

            <Link
              href="/weekly-deals"
              prefetch={false}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "bg-white text-green-700 hover:bg-green-100",
              })}
            >
              Weekly Deals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
