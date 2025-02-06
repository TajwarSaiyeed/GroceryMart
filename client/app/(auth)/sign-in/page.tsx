"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { authenticateUser } from "./actions/action";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SignInPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    toast.loading("Signing in...");
    try {
      const result = await authenticateUser(values.username, values.password);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Signed in successfully.");
        router.push("/");
        window.location.reload();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center gap-2 mb-4">
          <ShoppingCart className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-600">GroceryMart</span>
        </div>
        <h3 className="text-2xl font-bold text-center mb-6">Sign In</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-grey-dark text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
