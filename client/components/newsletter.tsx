"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Gift, Percent } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { manageSubscriber } from "@/actions/manage-subscriber";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Newsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    toast.loading("Subscribing...");
    try {
      const response = await manageSubscriber(values.email);
      toast.success(response.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  }
  return (
    <section className="my-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg overflow-hidden shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Get Fresh Deals in Your Inbox
          </h2>
          <p className="text-xl text-white/90 mb-6">
            Join our newsletter and enjoy these benefits:
          </p>
          <ul className="space-y-3">
            {[
              { icon: Gift, text: "Exclusive offers and promotions" },
              { icon: Percent, text: "First access to sales and discounts" },
              { icon: Mail, text: "Personalized product recommendations" },
            ].map(({ icon: Icon, text }, index) => (
              <li key={index} className="flex items-center text-white">
                <Icon className="h-6 w-6 mr-2 text-yellow-300" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2 max-w-md">
          <div className="bg-white p-6 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Subscribe Now
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-green-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-green-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
