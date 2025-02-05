"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createDeposit } from "../../actions/action";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
});

export default function DepositForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await createDeposit(values);

      if (response.success) {
        toast.success("Deposit successful! Check your email for confirmation.");
        if (session && session.user) {
          await update({
            ...session,
            user: {
              ...session.user,
              balance: session.user.balance + values.amount,
            },
          });
          router.push("/user/deposit/deposit-history");
        } else {
          toast.error("Session is not available. Please log in again.");
        }
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Failed to process deposit");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Make a Deposit</h1>
        <p className="text-muted-foreground mt-2">
          Enter the amount you want to deposit into your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
                      }
                      className="pl-7"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the amount you wish to deposit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Make Deposit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
